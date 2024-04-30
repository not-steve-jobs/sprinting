import http from 'k6/http';
import {group} from 'k6';
import {Rate} from 'k6/metrics';
import {
  baseUrl,
  defaultTenantId as tid,
  env,
  getRandomUserId,
  getRandomClientId,
  getJobRoleId,
  getStartDate,
  getEndDate,
  getParams,
} from '../helpers/constants.js';
import {initSetup} from '../helpers/lifecycleHelper.js';
import {checkFailureRate} from '../helpers/generateFailureCheckRate.js';
import {getJobOrderBody} from './joborderCreateRoute.js';

export {options} from '../helpers/constants.js';

const failureRate = new Rate('check_failure_rate');

const page = 1;
const itemsPerPageNotifications = 7;

const minimumWageBody = {
  experienceLevelId: 11,
};



const schemaName = 'New request, create job-order';

export function setup() {
  const {timestamp} = initSetup(tid, [tid]);

  return {timestamp};
}

export default function ({timestamp}) {
  const jobRoleId = getJobRoleId();
  const userId = getRandomUserId();
  const clientId = getRandomClientId();
  const startDate = getStartDate();
  const endDate = getEndDate(10);
  minimumWageBody.jobeRoleId = jobRoleId;

  group(`${schemaName} ENV ${env}`, function () {
    group('Step 1', function () {
      const responses = http.batch([
        {
          method: 'POST',
          url: `${baseUrl}/api/tenant/${tid}/notifications`,
          params: getParams(timestamp),
          body: JSON.stringify({page, itemsPerPage: itemsPerPageNotifications}),
        },
        {
          method: 'GET',
          url: `${baseUrl}/api/tenant/${tid}/all-permissions`,
          params: getParams(timestamp),
        },
        {
          method: 'GET',
          url: `${baseUrl}/api/tenant/${tid}/job-contacts`,
          params: getParams(timestamp),
        },
        {
          method: 'GET',
          url: `${baseUrl}/api/tenant/${tid}/work-types`,
          params: getParams(timestamp),
        },
      ]);

      checkFailureRate(failureRate, responses, schemaName);
    });

    group('Step 2', function () {
      const responses = http.batch([
        {
          method: 'GET',
          url: `${baseUrl}/api/tenant/${tid}/job-role/${jobRoleId}/template`,
          params: getParams(timestamp),
        },
        {
          method: 'POST',
          url: `${baseUrl}/api/tenant/${tid}/wage/minimum-wage`,
          params: getParams(timestamp),
          body: JSON.stringify(minimumWageBody),
        },
      ]);

      checkFailureRate(failureRate, responses, schemaName);
    });

    group('Step 3', function () {
      const responses = http.batch([
        {
          method: 'POST',
          url: `${baseUrl}/api/tenant/${tid}/jobOrder/create`,
          params: getParams(timestamp),
          body: JSON.stringify(getJobOrderBody(userId, clientId, startDate, endDate, jobRoleId)),
        },
      ]);

      checkFailureRate(failureRate, responses, schemaName);
    });
  });
}
