import http from 'k6/http';
import {group} from 'k6';
import {Rate} from 'k6/metrics';
import {baseUrl, defaultTenantId as tid, env, getParams, getRandomUserId} from '../helpers/constants.js';
import {initSetup} from '../helpers/lifecycleHelper.js';
import {checkFailureRate} from '../helpers/generateFailureCheckRate.js';

export {options} from '../helpers/constants.js';

const failureRate = new Rate('check_failure_rate');

const page = 1;
const itemsPerPage = 7;

const schemaName = 'Comunicaton case flow';

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
        params: getParams(timestamp),
        body: JSON.stringify({page, itemsPerPage}),
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/cases`,
        params: getParams(timestamp),
        body: JSON.stringify({page, itemsPerPage: 10, filter: {}, sort: {key: 'isImportant', value: 'ASC'}}),
      },
      {
        method: 'GET',
        url: `${baseUrl}/api/case-category/name/generalFeedback`,
        params: getParams(timestamp),
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/cases`,
        params: getParams(timestamp),
        body: JSON.stringify({page, itemsPerPage: 10, filter: {}, sort: {key: 'isImportant', value: 'ASC'}}),
      },
      {
        method: 'POST',
        url: `${baseUrl}/api/tenant/${tid}/case`,
        params: getParams(timestamp),
        body: JSON.stringify({
          tenantId: 137,
          caseCategoryId: 5,
          createdBy: userId,
          description: "k6_dynamic_value",
          entityName: "generalFeedback",
          subject: "k6_dynamic_value"
        }),
      }
    ]);

    checkFailureRate(failureRate, responses, schemaName);
  });
}
