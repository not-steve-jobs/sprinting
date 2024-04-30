import http from 'k6/http';
import {group} from 'k6';
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
import {checkFailureRate} from '../helpers/generateFailureCheckRate.js';

export {options} from '../helpers/constants.js';

const failureRate = new Rate('check_failure_rate');

const page = 1;
const itemsPerPage = 6;

const schemaName = 'Company information - 6 routes';

export function setup() {
  const {timestamp} = initSetup(tid, [tid]);

  return {timestamp};
}

export default function ({timestamp}) {
  const clientId = getRandomClientId();

  group(`${schemaName} ENV ${env}`, function () {
    const responses = http.batch([
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/notifications`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
        body: JSON.stringify({page, itemsPerPage}),
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/tenant/${tid}/client/${clientId}`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT}
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/case-category/name/companyInformation`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT}
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/case-category/name/newLocation`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT}
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/case-category/name/locationUpdate`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT}
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/clientId/${clientId}/location/search`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
        body: JSON.stringify({page, itemsPerPage, sort: {key: "", value: "DESC"}, filter: {status: "active"}})
      },
    ]);

    checkFailureRate(failureRate, responses, schemaName);
  });
}
