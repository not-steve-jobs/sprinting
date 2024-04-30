import process from 'process';
import fs from 'fs';
import path from 'path';

import {AppModule} from './app.module';
import {AppConfigService} from './core/config/appConfig.service';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

import {ErrorListInit} from './core/error/errorListInit';
import {WarningListInit} from './core/error/warningListInit';
import {InfoSystemEventsService} from './modules/integrations/infoSystem/infoSystemEvents.service';
import {InfoSystemCommandsService} from './modules/integrations/infoSystem/infoSystemCommands.service';
import {InfoSystemOutputService} from './modules/integrations/infoSystem/infoSystemOutput.service';
import {InfoSystemErrorService} from './modules/integrations/infoSystem/infoSystemError.service';
import {SalesForceErrorService} from './modules/integrations/salesForce/salesForceError.service';
import {FixService} from './modules/fix/fix.service';
import {Logger} from './core/logger';
import {SalesForceEventsService} from './modules/integrations/salesForce/salesForceEvents.service';
import {EmailQueueEventsService} from './modules/emailQueue/emailQueueEvents.service';
import {SalesForceOutputService} from './modules/integrations/salesForce/salesForceOutput.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  ErrorListInit();
  WarningListInit();

  const options = new DocumentBuilder()
    .setTitle('Client Access BE API')
    .setDescription(
      'Enabling Adecco Clients access to Staffing Requests, Associates and Candidates related to them, view and sign Contracts, view Invoices, get the Timesheets and enable direct communication with Adecco employees.',
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  if (process.argv.slice(2)[0] === '--generate-swagger') {
    try {
      // eslint-disable-next-line no-console
      console.log('generate swagger');
      const swaggerFile = JSON.stringify(document);
      const swaggerPath = path.join(process.cwd(), 'swagger-schema.json');
      fs.writeFileSync(swaggerPath, swaggerFile);
      // eslint-disable-next-line no-console
      console.log(`Swagger file ${swaggerPath} successfully created`);
      return 0;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Swagger file failed with error:', e);
      return -1;
    }
  }

  const logger = await app.resolve(Logger);
  const appConfig = app.get(AppConfigService);

  // START: Connect to Service Bus for commands and events.
  const infoSystemEvents = await app.resolve(InfoSystemEventsService);
  const infoSystemOutput = await app.resolve(InfoSystemOutputService);
  const infoSystemError = await app.resolve(InfoSystemErrorService);
  const salesForceEvents = await app.resolve(SalesForceEventsService);
  const salesForceOutput = await app.resolve(SalesForceOutputService);
  const salesForceError = await app.resolve(SalesForceErrorService);
  const emailQueueEvents = await app.resolve(EmailQueueEventsService);
  await infoSystemEvents.start();
  await infoSystemOutput.start();
  await infoSystemError.start();

  await salesForceEvents.start();
  await salesForceOutput.start();
  await salesForceError.start();

  await emailQueueEvents.start();

  if (appConfig.infoSystemIntegration.commandsEnabled) {
    await app.resolve(InfoSystemCommandsService);
  }
  // END: Connect to Service Bus for commands and events.

  app.enableCors({
    origin: '*',
    allowedHeaders: [
      // default
      'Accept',
      'Authorization',
      'Content-Type',
      'If-None-Match',
      // end default headers
      'x-api-version',
      'x-client-traceId',
      'x-device-platform',
      'x-request-traceId',
      'x-tenantId',
      'x-tenant-alias',
      'x-tenantalias',
      'x-requested-with',
      'x-permission-check',
      'Content-Security-Policy',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Strict-Transport-Security',
      'Referrer-Policy',
    ],
    maxAge: 600,
  });

  app.use(function (request, response, next) {
    const cspValues: string[] = [
      `default-src 'self';`,
      `font-src 'self'`,
      `img-src 'self'`,
      `script-src 'self'`,
      `style-src 'self'`,
      `frame-src 'self'`,
    ];
    response.setHeader('Content-Security-Policy', cspValues.join('; '));
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.setHeader('Referrer-Policy', 'origin-when-cross-origin');
    next();
  });

  await app.listen(appConfig.app.port);

  const appInfo = {port: appConfig.app.port, PID: process.pid};
  // eslint-disable-next-line no-console
  console.log(
    `App successfully started:\n${Object.keys(appInfo)
      .map((key) => `\t${key}:\t\t${appInfo[key]}\n`)
      .join('')}`,
  );

  try {
    await new FixService(logger).executePendingFixes(app);
  } catch (e) {
    logger.error(__filename, `Executing Code Fixes Error: ${e}`);
  }
}

bootstrap();
