/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const {roundTwoDigits} = require('./utils/mathUtil');
const {defaultTenantId} = require('../helpers/getNodeEnviromentVariables');
const reportsDir = path.join(__dirname, '../tests/summary');
const reportsFilesAll = fs.readdirSync(reportsDir);

const extension = '.json';
const reportsFiles = reportsFilesAll.filter((file) => path.extname(file).toLowerCase() === extension);

console.log('Reports dir: ', reportsDir);
console.log('Prepared summary files:', reportsFilesAll);

const {ELK_URL, ELK_USERNAME, ELK_PASSWORD, ELK_INDEX} = process.env;

const result = [];
const kibanaConfig = {
  baseURL: ELK_URL,
  auth: {
    username: ELK_USERNAME,
    password: ELK_PASSWORD,
  },
};
let tenant = defaultTenantId || '';

const options = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const commitId = (() => {
  try {
    const gitCommitRegex = /GIT_COMMIT=[0-9a-f]{40}/g;
    console.log(process.cwd(), 'process.cwd()');
    console.log(path.join(`${process.cwd()}/../`, 'public', 'version.txt'), 'path to the file');
    const versionFile = fs.readFileSync(path.join(`${process.cwd()}/../`, 'public', 'version.txt')).toString();
    const [gitCommitId] = versionFile.match(gitCommitRegex);
    return gitCommitId.replace('GIT_COMMIT=', '').substring(0, 8);
  } catch (err) {
    return 'invalid-commit-id';
  }
})();

const kibanaAxiosProvider = axios.create(kibanaConfig);

const createReports = async () => {
  try {
    for (let i = 0; i < reportsFiles.length; i++) {
      const fileCode = fs.readFileSync(path.join(reportsDir, reportsFiles[i]));
      let jsonCode;
      try {
        jsonCode = JSON.parse(fileCode);
      } catch (err) {
        jsonCode = {};
      }

      if (!(jsonCode && jsonCode.metrics && jsonCode.root_group && jsonCode.root_group.groups)) return;
      const {http_req_duration, vus_max, test_start_time, http_reqs, checks} = jsonCode.metrics;

      let testName = '';
      let baseEnv = '';

      Object.keys(jsonCode.root_group.groups).forEach((key) => {
        if (!testName && key !== 'setup' && key !== 'teardown') {
          const splitedTestNameAndUrl = key.split('ENV');
          testName = splitedTestNameAndUrl[0].trim();
          baseEnv = splitedTestNameAndUrl[1].trim() || '';
        }
      });

      // Object.keys(jsonCode.root_group.groups.setup.groups).forEach((key) => {
      //   if (key.startsWith('Tenant:')) {
      //     tenant = key.split('Tenant:')[1];
      //   }
      // });

      const {fails, passes} = checks;
      const passesPercent = roundTwoDigits((passes * 100) / (fails + passes));

      result.push({
        vu: vus_max.value,
        name: testName,
        avg: roundTwoDigits(http_req_duration.avg),
        p95: roundTwoDigits(http_req_duration['p(95)']),
        rps: roundTwoDigits(http_reqs.rate),
        count: http_reqs.count,
        passes: passesPercent,
        started: test_start_time ? new Date(test_start_time.value).toISOString().replace(/\..+/, '') : 'NaN',
        baseEnv: baseEnv,
        userAgent: test_start_time ? test_start_time.value : 0,
        tenant: String(tenant).trim(),
        commitId: commitId,
      });
    }

    if (result.length === 0) {
      throw new Error('There is nothing to report to ELK!');
    }

    for (let i = 0; i < result.length; i++) {
      let data = JSON.stringify(result[i]);
      const sentToKibana = await kibanaAxiosProvider.post(`${ELK_INDEX}_clientaccess/_doc`, data, options);
      console.log(`Finished sending to ELK. Status ${sentToKibana.status} ${sentToKibana.statusText}`);
      console.log('>>> COMMIT ID: ', commitId);
    }
  } catch (error) {
    console.error('FAILED', error);
    console.log('Error message: ', JSON.stringify(error.response.data));
    process.exit(1);
  }
};

createReports();
