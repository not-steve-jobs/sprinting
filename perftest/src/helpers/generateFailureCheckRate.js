import {check} from 'k6';

export const checkFailureRate = (failureRate, responses, schemaName) => {
  //let statuses = '';
  const respsCheckObject = {};
  responses.forEach((el, i) => {
    respsCheckObject[`${schemaName } status is OK and content is present`] = (r) => r[i].status >= 200 && r[i].status < 300;
  });

  failureRate.add(!check(responses, respsCheckObject));
};
