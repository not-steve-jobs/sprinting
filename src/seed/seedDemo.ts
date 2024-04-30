const allowedNodeEnvValueList = ['a-env', 'a-test', 'd-env', 't-env', 'tk6-env']; // TODO: Remove test env once #2776 is resolved
if (!allowedNodeEnvValueList.includes(process.env.NODE_ENV)) {
  console.info('skipping demo data');
  process.exit(0);
}

console.log('demo starting');

import {Connection} from 'typeorm';
import {NestFactory} from '@nestjs/core';
import {AppModule} from '../app.module';
import {demoSeed, DemoSeedServices} from './demo/demo.seed';
import {UserConsentService} from '../modules/userConsent/userConsent.service';
import {TenantUserPermissionService} from 'src/modules/tenantUserPermission/tenantUserPermission.service';

// make sure Azure Service Bus event handling and App Insights is disabled in all environments when running seeding.
process.env.AAMBACKEND_EVENTS_ENABLED = 'false';
process.env.AZURE_APPLICATION_INSIGHTS_ENABLED = 'false';

async function seedDemo() {
  console.log(`-----------------------------`);
  console.log(`Seed Starting #${process.pid}`);

  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.useLogger(null);

  const db: Connection = app.get(Connection);
  const userConsentService: UserConsentService = app.get(UserConsentService);
  const tenantUserPermissionService: TenantUserPermissionService = app.get(TenantUserPermissionService);

  const services: DemoSeedServices = {
    userConsentService,
    tenantUserPermissionService,
  };

  await demoSeed(db, services);

  console.log(`Seed Finished #${process.pid}`);
}

seedDemo().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
