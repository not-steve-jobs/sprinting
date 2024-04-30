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
  getRandomClientId,
} from '../helpers/constants.js';
import {initSetup} from '../helpers/lifecycleHelper.js';
import {checkFailureRate} from '../helpers/generateFailureCheckRate.js';

export {options} from '../helpers/constants.js';

const failureRate = new Rate('check_failure_rate');

const page = 1;
const itemsPerPage = 10;

const date = new Date(),
  y = date.getFullYear(),
  m = date.getMonth();
const firstDayInMonth = new Date(y, m, 1).toISOString();
const lastDayInMonth = new Date(y, m + 1, 0).toISOString();
const schemaName = 'Dashboard page - 15 routes';

export function setup() {
  const {timestamp} = initSetup(tid, [tid]);

  return {timestamp};
}

export default function ({timestamp}) {
  const userId = getRandomUserId();

  const clientId = getRandomClientId();

  group(`${schemaName} ENV ${env}`, function () {
    const responses = http.batch([
      {
        method: 'GET',
        url: `${baseUrl}/api/tenant/${tid}/user/${userId}/auth`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/tenant/${tid}/featureConfiguration/Localization/CLA`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/client/${clientId}/staffing-requests`,
        params: (() => {
          //IIFE is used because the destructuring is not working in k6
          const h = getHeaders(timestamp);
          h['x-permission-check'] = '1';
          return {headers: h, timeout: DEFAULT_TIMEOUT};
        })(),
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/invoices`,
        params: (() => {
          const h = getHeaders(timestamp);
          h['x-permission-check'] = '1';
          return {headers: h, timeout: DEFAULT_TIMEOUT};
        })(),
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/contracts`,
        params: (() => {
          const h = getHeaders(timestamp);
          h['x-permission-check'] = '1';
          return {headers: h, timeout: DEFAULT_TIMEOUT};
        })(),
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/tenant/${tid}/user/${userId}/user-profile`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/tenant/${tid}/client/${clientId}/main-menu`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/notifications`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
        body: JSON.stringify({page, itemsPerPage}),
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/client/${clientId}/staffing-requests-count`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
        body: JSON.stringify({findIn: [{key: 'status', value: ['draft']}]}),
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/client/${clientId}/staffing-requests-count`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
        body: JSON.stringify({
          findBetween: [{key: 'dateEnd', from: lastDayInMonth}],
          findIn: [
            {
              key: 'status',
              value: [
                'submitted',
                'candidatesPreselection',
                'partiallyCovered',
                'covered',
                'notFilledByAdecco',
                'canceledByTheClient',
                'inProgress',
              ],
            },
          ],
        }),
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/client/${clientId}/staffing-requests-count`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
        body: JSON.stringify({
          findBetween: [{key: 'dateEnd', to: firstDayInMonth}],
          findIn: [
            {
              key: 'status',
              value: ['submitted', 'candidatesPreselection', 'partiallyCovered', 'covered', 'notFilledByAdecco'],
            },
          ],
        }),
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/tenant/137/client/98553c2e-2000-4b25-b1ec-fc75204ff03a/staffing-requests-period?from=${firstDayInMonth}&to=${lastDayInMonth}`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/tenant/${tid}/featureConfiguration/Localization/CLA`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/tenant/${tid}/featureConfiguration/createJobOrderType/CLA`,
        params: {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT},
      },
    ]);

    checkFailureRate(failureRate, responses, schemaName);
  });
}
