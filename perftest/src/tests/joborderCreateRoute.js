import http from 'k6/http';
import {check, group} from 'k6';
import {Rate} from 'k6/metrics';
import {
  baseUrl,
  DEFAULT_TIMEOUT,
  defaultTenantId as tid,
  env,
  getEndDate,
  getHeaders,
  getJobRoleId,
  getRandomClientId,
  getRandomUserId,
  getStartDate,
} from '../helpers/constants.js';
import {initSetup} from '../helpers/lifecycleHelper.js';

export {options} from '../helpers/constants.js';


export const getJobOrderBody = (userId, clientId, startDate, endDate, jobRoleId) => ({
  userId: userId,
  clientId: clientId,
  name: 'Temporary',
  locationId: '00000000-0000-4000-0000-000000000139',
  serviceTypeId: 18,
  dateStart: startDate,
  dateEnd: endDate,
  startTime: '05:30:00',
  endTime: '11:30:00',
  numberOfOpenings: 1,
  experienceId: 10,
  salary: 1,
  salaryHigh: 0,
  daysInWeek: ['tuesday', 'wednesday'],
  rateId: 13,
  jobRoleId: jobRoleId,
  languages: [],
  certifications: [],
  jobDescription: 'test description k6',
  dayOneGuidance: '',
  additionalInformation: '',
  files: [],
});

const failureRate = new Rate('check_failure_rate');

export function setup() {
  const {timestamp} = initSetup(tid, [tid]);
  const params = {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT};
  const url = `${baseUrl}/api/tenant/${tid}/jobOrder/create`;
  return {url, params};
}

export default function ({url, params}) {
  const jobRoleId = getJobRoleId();
  const userId = getRandomUserId();
  const clientId = getRandomClientId();
  const startDate = getStartDate();
  const endDate = getEndDate(10);

  const body = getJobOrderBody(userId, clientId, startDate, endDate, jobRoleId);
  group(`Create JobOrder ENV ${env}`, function () {
    const response = http.post(url, JSON.stringify(body), params);
    const checkRes = check(response, {
      'status is 201 Created and content is present': (r) => r.status === 201 && r.body && r.body.length > 0,
    });

    failureRate.add(!checkRes);
  });
}
