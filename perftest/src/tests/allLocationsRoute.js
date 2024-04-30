import http from 'k6/http';
import {check, group} from 'k6';
import {Rate} from 'k6/metrics';
import {
  getHeaders,
  baseUrl,
  defaultTenantId as tid,
  DEFAULT_TIMEOUT,
  env,
  getRandomClientId,
} from '../helpers/constants.js';
import {initSetup} from '../helpers/lifecycleHelper.js';

export {options} from '../helpers/constants.js';

const failureRate = new Rate('check_failure_rate');

export function setup() {
  const {timestamp} = initSetup(tid, [tid]);
  const params = {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT};

  return {params};
}

export default function ({params}) {
  const clientId = getRandomClientId();
  const url = `${baseUrl}/api/clientId/${clientId}/all-locations`;

  //we need env to filter the tests that are triggered on pipeline from
  //the local ones
  group(`Get All-locations ENV ${env}`, function () {
    const response = http.get(url, params);
    const checkRes = check(response, {
      'status is 200 OK and content is present': (r) => r.status === 200 && r.body && r.body.length > 0,
    });

    failureRate.add(!checkRes);
  });
}
