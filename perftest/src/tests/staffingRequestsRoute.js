import http from 'k6/http';
import {check, group} from 'k6';
import {Rate} from 'k6/metrics';
import {
  baseUrl,
  DEFAULT_TIMEOUT,
  defaultTenantId as tid,
  env,
  getHeaders,
  getRandomClientId,
} from '../helpers/constants.js';
import {initSetup} from '../helpers/lifecycleHelper.js';

export {options} from '../helpers/constants.js';

const failureRate = new Rate('check_failure_rate');

const year = new Date().getFullYear();
const month = new Date().getFullYear();
const day = new Date().getFullYear();

const body = {
  page: 1,
  itemsPerPage: 10,
  sort: {key: 'number', value: 'ASC'},
  filter: {
    findBetween: {
      key: 'dateStart',
      from: new Date(year, month, day, 0, 0, 1),
      to: new Date(year, month, day, 23, 59, 59),
    },
  },
};

export function setup() {
  const {timestamp} = initSetup(tid, [tid]);
  const params = {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT};
  return {params};
}

export default function ({params}) {
  const clientId = getRandomClientId();
  const url = `${baseUrl}/api/tenant/${tid}/client/${clientId}/staffing-requests`;

  group(`FetchAll Staffing-requests ENV ${env}`, function () {
    const response = http.post(url, JSON.stringify(body), params);
    const checkRes = check(response, {
      'status is 201 Created and content is present': (r) => r.status === 201 && r.body && r.body.length > 0,
    });

    failureRate.add(!checkRes);
  });
}
