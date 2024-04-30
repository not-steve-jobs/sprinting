//eslint-disable-next-line
const fs = require('fs');
//eslint-disable-next-line
const path = require('path');
//eslint-disable-next-line
const puppeteer = require('puppeteer');

const WAIT_FOR_SELECTOR_TIMEOUT = {visible: true, timeout: 20000};
const TEST_USERS_FILE_PATH = path.join(__dirname, '../../ready-test-users.json');

const local_suffix = process.argv[2] ? `-${process.argv[2]}` : '';
const TEST_USERS_TEMPLATE_FILE_PATH = path.join(__dirname, `../../test-users-templates${local_suffix}.json`);
const APPLICABLE_FOR_TENANTS = [137];

const {
  password,
  baseUrl,
  loginUrl,
  numberOfTestUsers,
  tenantId,
  //eslint-disable-next-line
} = require('../../helpers/getNodeEnviromentVariables.js');

const login = async (page, testUser) => {
  try {
    await page.goto(`${loginUrl}?tenantId=${tenantId}`, {waitUntil: 'networkidle2'});
    //eslint-disable-next-line
    console.log(testUser, 'testUser');
    //eslint-disable-next-line
    console.log(`${loginUrl}?tenantId=${tenantId}`);

    await page.waitForTimeout(5000);
    //eslint-disable-next-line
    console.log(`${testUser.email} is redirected to IDP`);

    await Promise.all([page.waitForSelector('#localAccountForm', WAIT_FOR_SELECTOR_TIMEOUT)]);
    //eslint-disable-next-line
    console.log(`${testUser.email} submiting credentials`);

    await page.focus('#signInName');
    await page.keyboard.type(testUser.email);
    await page.focus('#password');
    await page.keyboard.type(password);
    await page.click('#next');
    await page.waitForNavigation('networkidle2');
    await page.waitForNavigation('networkidle2');

    //eslint-disable-next-line
    console.log(`${testUser.email} is redirected back to ClientAccess`);

    await page.waitForTimeout(5000);
    const localStorage = await page.evaluate(() => Object.assign({}, window.localStorage));
    const parsedTokenStorage = JSON.parse(localStorage.tokenStorage_tokenKey);
    testUser.token = parsedTokenStorage.token;
    testUser.B2CId = parsedTokenStorage.sub;

    await page.evaluate(() => localStorage.clear());
    //eslint-disable-next-line
    console.log(`${testUser.email} is logged in`);
  } catch (err) {
    //eslint-disable-next-line
    console.error('Error in Logging users', err);
  }
};

const run = async () => {
  try {
    if (APPLICABLE_FOR_TENANTS.indexOf(tenantId) === -1) {
      throw new Error(`This login is not applicable for tenant: ${tenantId}`);
    }
    //eslint-disable-next-line
    console.log(`Preparing users on ${baseUrl}`);

    const testUsers = JSON.parse(fs.readFileSync(TEST_USERS_TEMPLATE_FILE_PATH, 'utf8'));
    testUsers.baseUrl = baseUrl;

    let testUsersByTenantId = testUsers.tenantIds.filter((t) => t.tenantId === tenantId)[0].users;

    if (numberOfTestUsers) {
      testUsersByTenantId = testUsersByTenantId.slice(0, numberOfTestUsers);
    }

    const browser = await puppeteer.launch({
      args: ['--incognito'],
    });

    const context = await browser.createIncognitoBrowserContext();
    for (const testUser of testUsersByTenantId) {
      const page = await context.newPage();
      await login(page, testUser);
      await page.close();
    }

    await browser.close();
    fs.writeFileSync(TEST_USERS_FILE_PATH, JSON.stringify(testUsers, null, 2));
  } catch (err) {
    //eslint-disable-next-line
    console.log('Error:', err);
  }
};

run();
