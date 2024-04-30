import http from 'k6/http';
import {check, group} from 'k6';
import {Rate} from 'k6/metrics';
import {baseUrl, DEFAULT_TIMEOUT, defaultTenantId as tid, env, getHeaders} from '../helpers/constants.js';
import {initSetup} from '../helpers/lifecycleHelper.js';

export {options} from '../helpers/constants.js';

const failureRate = new Rate('check_failure_rate');

export function setup() {
  const {timestamp} = initSetup(tid, [tid]);
  const params = {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT};
  const url = `${baseUrl}/api/tenant/${tid}/types`;
  return {url, params};
}

export default function ({url, params}) {
  group(`Get Types ENV ${env}`, function () {
    const response = http.get(url, params);
    const checkRes = check(response, {
      'status is 200 OK and content is present': (r) => r.status === 200 && r.body && r.body.length > 0,
    });

    failureRate.add(!checkRes);
  });
}
