# e2e tests

The purpose of this README is to provide a basic information on how to setup the local env and understand the idea behind the API tests

## General Idea

The e2e tests are running on a test env which is a complete replica of the real Nest.js app. In case you need it you can mock some of the services in order to skip some specific behavior which is related with external services or integrations.

The e2e tests are executed on the real database so in order to ensure that the data we need is there we rely on seeds:

- it should not be confused by the `src/seed`, it's a separate one only for the e2e tests and resided in the `test/e2e` folder. We have predefined records for all of the entities and we seed the whole database before the execution of every suite. This way we ensure that our tests will perform on a specific set of data which they require
- after the execution of the tests the database is automatically cleaned up of those seeds and the record which were created by the different tests. This way we ensure that the database won't be filled with dummy and unnecessary test data
  NOTE: We have to consider using a a separate database for the tests in the Azure DevOps

## How to contribute?

### Setup

1. Create `.env.a-test` following the `env.example` file. You can use your own `.env.a-env` as a guideline but be sure that you have set the following variables because they're required for the execution of the e2e tests

```
E2E_TESTS_USER_EMAIL=
E2E_TESTS_USER_PASSWORD=
```

1.1. As a temporary solution you have to run the default seeds to prepare the database (if #2776 is not resolved yet)

```
npm run db:reset:a-test
```

2. Run `npm run test:e2e`. That's all, hopefully all tests will pass.

Note: This will run the commands listed bellow. If you want to speed up your process while writing tests you can run only `npm run test:e2e:run` on a seeded database

```
npm run test:e2e:seed
npm run test:e2e:run
npm run test:e2e:cleanup
```

Note: If you want to run a specific test suite you can use the following command:

```
npm run test:e2e:run -e featureConfiguration
```

### Folder Structure

```
cats/
  cats.e2e-spec.ts
  data.ts
  seed.ts
utils/
  seed.ts
```

- `cats/cats.e2e-spec.ts` - the main spec file with a test suite for the Cats module containing all of the test cases for the different API endpoints. Follow the guideline in the already implemented spec files, but the general idea is to split the different API endpoints into describe blocks and have multiple tests (positive and negative) for every one of them
- `cats/data.ts` - a simple object with dummy data used by the different tests
- `cats/seed.ts` - a database helper for the Cats module which main purpose is to provide implementation how to seed the data required by the tests
- `utils/seed.ts` - main database helper which is used to seed the database and prepare a fixed set of data for the tests. It also provides a way to clean the database from the dummy data created from the tests

3. Code Coverage

There is a built-in way to collect code coverage, simply pass the `--coverage` param and it will add it to the output.

```
npm run test:e2e -- --coverage
```

Also you can open it in your browser and take a detailed look: `coverage-e2e/lcov-report/index.html`
