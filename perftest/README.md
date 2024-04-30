### How to start

0.1. Follow the official guide to install K6 on your env [https://k6.io/docs/getting-started/installation/]
0.2. install locally: **npm i puppeteer@7.1.0 --save-dev** and `DO NOT COMMIT`
Note: make sure you're in the `\clientaccess-be\perftest` directory before you install this dependency
0.3. introduce **config.json** (if not exist/defined) for running tests in local (developer) environment

1. make sure you have local BE server started (`npm run start:dev`, and if need before that `npm run build`)
2. run script `npm run login:local` (must start FE server in local) from dir `\clientaccess-be\perftest` (this will populate `ready-test-users.json` with users per tenant, and add token for each user; this file is in `.gitignore` file)
3. try to run test between `npm run alllocations`-`npm run userconsent:marketing`

### "../CI/perftest"

Directory for all of the things we needed to run k6 tests ni the pipeline.

### "../CI/preftest/templates"

Setup files for the pipeline go here, for various types of tests, mostly the difference in these files is the number of users that are accessing the site and exclusion or inclusion of certain tests.

### "../perftest/src/config.example.json"

Stores data for developers to run tests from their local machine, variables include url, user, password, number of virtual users and other performance test options avalable to us in k6.
This file should be renamed to **config.json** and excluded from commits, for it is meant for local test running, tests in the pipeline are setup via files stored in "../CI/perftest/templates"
