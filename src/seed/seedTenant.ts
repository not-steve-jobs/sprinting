const allowedNodeEnvValueList = ['a-env', 'a-test', 'd-env', 't-env', 'u-env', 'p-env', 'tk6-env']; // TODO: Remove test env once #2776 is resolved
if (!allowedNodeEnvValueList.includes(process.env.NODE_ENV)) {
  console.error(
    `Invalid NODE_ENV environment variable '${process.env.NODE_ENV}' - must be one of ${allowedNodeEnvValueList}`,
  );
  process.exit(1);
}

import {Connection} from 'typeorm';
import {NestFactory} from '@nestjs/core';
import {AppModule} from '../app.module';
import {tenantSpecificSeed} from './tenantSpecific/tenant.seed';
import {AppConfigService} from '../core/config/appConfig.service';

// make sure Azure Service Bus event handling and App Insights is disabled in all environments when running seeding.
process.env.AAMBACKEND_EVENTS_ENABLED = 'false';
process.env.AZURE_APPLICATION_INSIGHTS_ENABLED = 'false';

async function seedTenantSpecific() {
  console.log(`-----------------------------`);
  console.log(`Seed tenant specific starting #${process.pid}`);

  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.useLogger(null);

  const db = app.get<Connection>(Connection);
  const appConfig = app.get(AppConfigService);

  await tenantSpecificSeed(db, appConfig.envPrefix);

  console.log(`Seed tenant specific finished #${process.pid}`);
}

seedTenantSpecific().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
