const configOptions = (() => {
  return JSON.parse(open('../config.json'));
})();
const tenantSettings = JSON.parse(open('./tenantSettings.json'));

export const DEFAULT_TIMEOUT = 360000; // 360 seconds

//ENV variables are used for runs in CI, configOptions are used for local runs
//local runs use config.json that should never be committed to the repo as it is local testing ONLY
export const username = __ENV.USERNAME || configOptions.username;
export const password = __ENV.PASS || configOptions.password;
export const baseUrl = __ENV.BASE_URL || configOptions.baseUrl;
export const apimKey = __ENV.APIMKEY || configOptions.apimKey;
export const loginUrl = __ENV.LOGIN_URL || configOptions.loginUrl;
export const virtualUsers = parseInt(__ENV.VUS) || configOptions.virtualUsers;
export const duration = __ENV.DURATION || configOptions.duration;
export const rampDuration = __ENV.RAMP_DURATION || configOptions.rampDuration;
export const defaultTenantId = parseInt(__ENV.TENANT_ID) || configOptions.tenantId;
export const fullFailureCheck = __ENV.FULL_FAILURE_CHECK || configOptions.fullFailureCheck;
export const testStepDelaySeconds = parseInt(__ENV.DELAY_SECONDS) || configOptions.delaySeconds;
export const env = __ENV.NODE_ENV || configOptions.nodeEnv;

const testData = JSON.parse(open('../ready-test-users.json'));

export function getHeaders(timestamp = 0) {
  let userTokens = [];
  testData.tenantIds
    .find((x) => x.tenantId === defaultTenantId)
    .users.forEach((user) => {
      userTokens.push(user.token);
    });

  return {
    'Content-Type': 'application/json; charset=utf-8',
    'X-TenantId': defaultTenantId,
    'K6-perf-test-timestamp': timestamp,
    'User-Agent': `${timestamp}`,
    'K6-perf-lifecycle': 'test',
    authorization: userTokens[getRandomInt(userTokens.length)],
    'Ocp-Apim-Subscription-Key': apimKey,
  };
}

// options for ramp up, plato and ramp down amount of virtual users
export const options = {
  stages: [
    {duration: rampDuration, target: virtualUsers},
    {duration, target: virtualUsers},
    {duration: rampDuration, target: 0},
  ],
  setupTimeout: '60s',
  thresholds: {
    errors: ['count<5'],
  },
};

export const testUsers = (() => {
  let testUsersCredentials;
  try {
    testUsersCredentials = open('../ready-test-users.json');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('There are no test users!');
  }
  return testUsersCredentials && JSON.parse(testUsersCredentials);
})();

export const getRandomInt = (max) => {
  //max possible random int returned is always 'max - 1'
  if (max === 0) return max;
  const time = new Date().getTime();
  const randValue = time % max;
  return parseInt(String(randValue));
};

export const getRandomUserId = () => {
  const users = testUsers.tenantIds.find((x) => x.tenantId === defaultTenantId).users;
  const randomNumber = getRandomInt(users.length);
  return users[randomNumber].id;
};

export const getRandomClientId = () => {
  const clients = tenantSettings.tenants.find((tenant) => tenant.id === defaultTenantId).clients;
  const randomNumber = getRandomInt(clients.length);
  return clients[randomNumber].id;
};

export const getJobRoleId = () => {
  const jobRoles = tenantSettings.tenants.find((tenant) => tenant.id === defaultTenantId).jobRoles;
  const randomNumber = getRandomInt(jobRoles.length);
  return jobRoles[randomNumber];
};

export const getStartDate = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  return startDate.toISOString();
};

export const getEndDate = (numberOfDays) => {
  if(!numberOfDays) numberOfDays = 1;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + numberOfDays);
  return endDate.toISOString();
};

export const getParams = (timestamp) => {
  return {headers: getHeaders(timestamp), timeout: DEFAULT_TIMEOUT};
}
