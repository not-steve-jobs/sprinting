import http from 'k6/http';
import {check, group} from 'k6';
import {Rate} from 'k6/metrics';
import {baseUrl, DEFAULT_TIMEOUT, defaultTenantId as tid, env, getHeaders} from '../helpers/constants.js';
import {initSetup} from '../helpers/lifecycleHelper.js';

export {options} from '../helpers/constants.js';

const failureRate = new Rate('check_failure_rate');

const body = {
  page: 1,
  itemsPerPage: 10,
};

export function setup() {
  const {timestamp} = initSetup(tid, [tid]);
  const params = {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT};
  const url = `${baseUrl}/api/tenant/${tid}/notifications`;
  return {url, params};
}

export default function ({url, params}) {
  group(`Fetch Notifications ENV ${env}`, function () {
    const response = http.post(url, JSON.stringify(body), params);
    const checkRes = check(response, {
      'status is 201 Created and content is present': (r) => r.status === 201 && r.body && r.body.length > 0,
    });

    failureRate.add(!checkRes);
  });
}
