import {LocationRepository} from './../modules/location/location.repository';
import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AzureApplicationInsightsHelper} from '../helpers/azureApplicationInsights.helper';
import {AppConfigService} from './config/appConfig.service';
import {JwtHelper} from '../helpers/jwt.helper';
import {ContextService} from './context/context.service';
import {Logger} from './logger';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthHelper} from '../helpers/auth.helper';
import {UtilsHelper} from '../helpers/utils.helper';
import {InitAuthenticationContextMiddleware} from './auth/initAuthenticationContext.middleware';
import {TenantUserRepository} from '../modules/tenantUser/tenantUser.repository';
import {ExportHelper} from '../helpers/export.helper';
import {ExportToCsv} from 'export-to-csv';
import {ApmHelper} from '../helpers/elk/apm.helper';

@Module({
  imports: [TypeOrmModule.forFeature([LocationRepository, TenantUserRepository]), ConfigModule],
  providers: [
    AppConfigService,
    JwtHelper,
    ContextService,
    Logger,
    AuthHelper,
    UtilsHelper,
    AzureApplicationInsightsHelper,
    ExportHelper,
    ExportToCsv,
    ApmHelper,
  ],
  exports: [
    TypeOrmModule, // LocationRepository and TenantUserRepository are required anywhere the AuthGuard is used, so they must be re-exported here
    AppConfigService,
    JwtHelper,
    ContextService,
    Logger,
    AuthHelper,
    UtilsHelper,
    AzureApplicationInsightsHelper,
    ExportHelper,
    ExportToCsv,
    ApmHelper,
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InitAuthenticationContextMiddleware).forRoutes('*');
  }
}
