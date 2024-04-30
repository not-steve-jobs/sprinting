import http from 'k6/http';
import {group} from 'k6';
import {Rate} from 'k6/metrics';
import {
  baseUrl,
  DEFAULT_TIMEOUT,
  defaultTenantId as tid,
  env,
  getHeaders,
  getRandomUserId,
} from '../helpers/constants.js';
import {initSetup} from '../helpers/lifecycleHelper.js';
import {checkFailureRate} from '../helpers/generateFailureCheckRate.js';

export {options} from '../helpers/constants.js';

const failureRate = new Rate('check_failure_rate');

const page = 1;
const itemsPerPage = 6;

const schemaName = 'My colleagues - 3 routes';

export function setup() {
  const {timestamp} = initSetup(tid, [tid]);

  return {timestamp};
}

export default function ({timestamp}) {
  const userId = getRandomUserId();

  group(`${schemaName} ENV ${env}`, function () {
    const responses = http.batch([
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/notifications`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
        body: JSON.stringify({page, itemsPerPage}),
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/user/${userId}/my-colleagues`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
        body: JSON.stringify({page, itemsPerPage, sort: {key: "userType", value: "ASC"}}),
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/case-category/name/roleChange`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT}
      }
    ]);

    checkFailureRate(failureRate, responses, schemaName);
  });
}
