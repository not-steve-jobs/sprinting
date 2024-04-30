/* eslint-disable no-console */
import {Connection} from 'typeorm';
import {NestFactory} from '@nestjs/core';

import {AppModule} from 'src/app.module';
import {DatabaseHelper, MainDatabaseHelper} from 'test/e2e/utils/seed';

// make sure Azure Service Bus event handling and App Insights is disabled in all environments when running seeding.
process.env.AAMBACKEND_EVENTS_ENABLED = 'false';
process.env.AZURE_APPLICATION_INSIGHTS_ENABLED = 'false';

/**
 * Start a cleanup task in order to delete all of the seeded data and revert the
 * database in the previous state so it won't be flooded with any dummy test records
 *
 */
async function cleanup() {
  console.log(`-----------------------------`);
  console.log(`Cleanup the TEST environment after the e2e tests:`);

  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.useLogger(null);
  app.get<Connection>(Connection);

  const databaseHelper: DatabaseHelper = new MainDatabaseHelper();
  console.log(' > Cleanup the database');

  databaseHelper.prepareCleanup();
  await databaseHelper.cleanup();
  console.log('   Done.');

  console.log('Done with the cleanup of the TEST environment after the e2e tests.');
}

cleanup().then(
  () => {
    process.exit(0);
  },
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
