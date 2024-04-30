/* eslint-disable no-console */
import {Connection} from 'typeorm';
import {NestFactory} from '@nestjs/core';

import {AppModule} from 'src/app.module';
import {DatabaseHelper, MainDatabaseHelper} from 'test/e2e/utils/seed';

// make sure Azure Service Bus event handling and App Insights is disabled in all environments when running seeding.
process.env.AAMBACKEND_EVENTS_ENABLED = 'false';
process.env.AZURE_APPLICATION_INSIGHTS_ENABLED = 'false';

/**
 * Start a seed task in order to prepare the database for the e2e tests and add some seeds
 * which will ensure that the DB is in a state to perform the tests
 *
 */
async function seed() {
  console.log(`-----------------------------`);
  console.log(`Prepare the TEST environment for the e2e tests:`);

  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.useLogger(null);
  app.get<Connection>(Connection);

  const databaseHelper: DatabaseHelper = new MainDatabaseHelper();
  console.log(' > Seed the database');

  await databaseHelper.seed();
  console.log('   Done.');

  console.log('Done with the preparation of the TEST environment for the e2e tests.');
}

seed().then(
  () => {
    process.exit(0);
  },
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
