// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const K6_CONFIG_FILE_PATH = path.join(__dirname, '../config.json');
const configOptions = JSON.parse(fs.readFileSync(K6_CONFIG_FILE_PATH));
const GENERIC_TENANT = 99;

module.exports = {
  password: process.env.PASS || configOptions.password,
  baseUrl: process.env.BASE_URL || configOptions.baseUrl,
  defaultTenantId: parseInt(process.env.TENANT_ID) || configOptions.tenantId,
  numberOfTestUsers: parseInt(process.env.NUMBER_OF_TEST_USERS) || null,
  loginUrl: process.env.LOGIN_URL || configOptions.loginUrl,
  tenantId: parseInt(process.env.TENANT_ID) || configOptions.tenantId || GENERIC_TENANT,
};
