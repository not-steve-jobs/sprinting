import {WorkplaceModule} from './modules/workplace/workplace.module';
import {WorkTypeModule} from './modules/workType/workType.module';
import {ConsoleModule} from 'nestjs-console';
import {CloseReasonModule} from './modules/closeReason/closeReason.module';
import {CloseReasonArgumentsModule} from './modules/closeReasonArguments/closeReasonArguments.module';
import {LocationBranchModule} from './modules/locationBranch/locationBranch.module';
import {EmploymentTypeModule} from './modules/employmentType/employmentType.module';
import {MiddlewareConsumer, Module, NestModule, Scope, ValidationPipe} from '@nestjs/common';
import {ScheduleModule} from '@nestjs/schedule';
import {LogRequestStartInterceptor} from './core/logRequestStart.interceptor';
import {CommonModule} from './modules/common/common.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from './modules/user/user.module';
import {APP_FILTER, APP_INTERCEPTOR, APP_PIPE} from '@nestjs/core';
import {TenantRepository} from './modules/tenant/tenant.repository';
import {ConfigModule} from '@nestjs/config';
import {GlobalErrorFilter} from './core/globalError.filter';
import {AppConfigService} from './core/config/appConfig.service';
import {CoreModule} from './core/core.module';
import {CurrencyModule} from './modules/currency/currency.module';
import {RoleModule} from './modules/role/role.module';
import {FeatureConfigurationModule} from './modules/featureConfiguration/featureConfiguration.module';
import {SetGlobalLogContextInterceptor} from './core/setGlobalLogContext.interceptor';
import {SetTraceContextInterceptor} from './core/setTraceContext.interceptor';
import {SetClientContextInterceptor} from './core/setClientContext.interceptor';
import {SharedErrors} from './core/error/shared.error';
import {ClientModule} from './modules/client/client.module';
import {JobRoleModule} from './modules/jobRole/jobRole.module';
import {CountryModule} from './modules/country/country.module';
import {ContractModule} from './modules/contract/contract.module';
import path from 'path';
import {InvoiceModule} from './modules/invoice/invoice.module';
import {ClientProfileModule} from './modules/clientProfile/clientProfile.module';
import {UserProfileModule} from './modules/userProfile/userProfile.module';
import {LocationModule} from './modules/location/location.module';
import {TenantUserLocationModule} from './modules/tenantUserLocation/tenantUserLocation.module';
import {SetTenantContextMiddleware} from './core/setTenantContext.middleware';
import {AzureIdpAuthMiddleware} from './core/auth/azureIdpAuth.middleware';
import {StatusModule} from './modules/status/status.module';
import {UserConsentModule} from './modules/userConsent/userConsent.module';
import {ConsentModule} from './modules/consent/consent.module';
import {PermissionModule} from './modules/permission/permission.module';
import {TenantUserPermissionModule} from './modules/tenantUserPermission/tenantUserPermission.module';
import {BranchModule} from './modules/branch/branch.module';
import {ServiceTypeModule} from './modules/serviceType/serviceType.module';
import {ShiftModule} from './modules/shift/shift.module';
import {RateModule} from './modules/rate/rate.module';
import {SectorModule} from './modules/sector/sector.module';
import {LevelModule} from './modules/level/level.module';
import {LanguageModule} from './modules/language/language.module';
import {CertificationModule} from './modules/certification/certification.module';
import {JobOrderModule} from './modules/jobOrder/jobOrder.module';
import {JobOrderLanguageModule} from './modules/jobOrderLanguage/jobOrderLanguage.module';
import {JobOrderCertificationModule} from './modules/jobOrderCertification/jobOrderCertification.module';
import {AuditLogModule} from './modules/auditLog/auditLog.module';
import {ScheduledJobsModule} from './modules/scheduledJobs/scheduledJobs.module';
import {CaseModule} from './modules/case/case.module';
import {AzureCognitiveSearchModule} from './modules/azureCognitiveSearch/azureCognitiveSearch.module';
import {DepartmentFunctionModule} from './modules/departmentFunction/departmentFunction.module';
import {DepartmentModule} from './modules/department/department.module';
import {TranslationModule} from './modules/translation/translation.module';
import {CaseCommentModule} from './modules/caseComment/caseComment.module';
import {FileModule} from './modules/file/file.module';
import {TypeModule} from './modules/type/type.module';
import {InfoSystemModule} from './modules/integrations/infoSystem/infoSystem.module';
import {CaseCategoryModule} from './modules/caseCategory/caseCategory.module';
import {NotificationModule} from './modules/notification/notification.module';
import {NotificationSenderModule} from './modules/scheduledJobs/notificationSender/notificationSenderModule.module';
import {ClientConfigurationModule} from './modules/clientConfiguration/clientConfiguration.module';
import {TenantUserModule} from './modules/tenantUser/tenantUser.module';
import {AuthModule} from './modules/auth/auth.module';
import {PersonModule} from './modules/person/person.module';
import {HistoricalReportModule} from './modules/historicalReport/historicalReport.module';
import {NetPromoteScoreModule} from './modules/netPromoteScore/netPromoteScore.module';
import {RegionModule} from './modules/region/region.module';
import {RegionWageModule} from './modules/regionWage/regionWage.module';
import {RegionPostalCodeModule} from './modules/regionPostalCode/regionPostalCode.module';
import {AvailableWorkersModule} from './modules/availableWorkers/availableWorkers.module';
import {JobRoleTemplateModule} from './modules/jobRoleTemplate/jobRoleTemplate.module';
import {JobOrderAssociateCaseModule} from './modules/jobOrderAssociateCase/jobOrderAssociateCase.module';
import {ReportModule} from './modules/report/report.module';
import {EmailNotificationModule} from './modules/emailNotification/emailNotification.module';
import {ThrottlerModule} from '@nestjs/throttler';
import {EmailLogModule} from './modules/emailLog/emailLog.module';
import {TransformationsModule} from './modules/transformations/transformations.module';
import {AppCacheModule} from './appCache/appCache.module';
import {SalesForceModule} from './modules/integrations/salesForce/salesForce.module';
import {EmailQueueModule} from './modules/emailQueue/emailQueue.module';
import {CustomHttpModule} from './modules/customHttp/customHttp.module';

/* eslint-disable @typescript-eslint/no-var-requires */
const envConfigFile = require(path.resolve(__dirname, `../config/${process.env.NODE_ENV}`));
/* eslint-enable @typescript-eslint/no-var-requires */

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfigFile],
      envFilePath: [`.env.${process.env.NODE_ENV}.local`, `.env.local`, `.env.${process.env.NODE_ENV}`, `.env`],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (appConfig: AppConfigService) => ({
        type: 'postgres',
        ...appConfig.db,
        entities: [`${__dirname}/modules/**/*.entity{.ts,.js}`],
      }),
      imports: [CoreModule],
      inject: [AppConfigService],
    }),
    ThrottlerModule.forRoot(),
    ConsoleModule,
    UserModule,
    ClientProfileModule,
    CountryModule,
    TypeOrmModule.forFeature([
      TenantRepository, // Required for SetTenantContextMiddleware
    ]),
    CommonModule,
    CoreModule,
    CustomHttpModule,
    CurrencyModule,
    RoleModule,
    PersonModule,
    FeatureConfigurationModule,
    ClientModule,
    JobRoleModule,
    JobRoleTemplateModule,
    ContractModule,
    CaseModule,
    CaseCategoryModule,
    EmailNotificationModule,
    EmailLogModule,
    InvoiceModule,
    UserProfileModule,
    LocationModule,
    LocationBranchModule,
    StatusModule,
    ConsentModule,
    UserConsentModule,
    PermissionModule,
    TenantUserPermissionModule,
    TenantUserLocationModule,
    BranchModule,
    ServiceTypeModule,
    ShiftModule,
    SectorModule,
    LevelModule,
    LanguageModule,
    CertificationModule,
    JobOrderModule,
    JobOrderLanguageModule,
    JobOrderCertificationModule,
    AuditLogModule,
    DepartmentModule,
    DepartmentFunctionModule,
    TranslationModule,
    AzureCognitiveSearchModule,
    CaseCommentModule,
    FileModule,
    RateModule,
    EmploymentTypeModule,
    TypeModule,
    InfoSystemModule,
    EmailQueueModule,
    NotificationModule,
    NotificationSenderModule,
    ClientConfigurationModule,
    TenantUserModule,
    ScheduledJobsModule,
    AuthModule,
    CloseReasonModule,
    CloseReasonArgumentsModule,
    HistoricalReportModule,
    NetPromoteScoreModule,
    RegionModule,
    RegionWageModule,
    RegionPostalCodeModule,
    AvailableWorkersModule,
    JobOrderAssociateCaseModule,
    ReportModule,
    WorkTypeModule,
    WorkplaceModule,
    TransformationsModule,
    AppCacheModule,
    SalesForceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        exceptionFactory: (validationErrors) => {
          return new SharedErrors.DataValidationError({validationErrors});
        },
      }),
    },
    /* {
      provide: APP_GUARD,
      scope: Scope.REQUEST,
      useClass: SetTenantContextGuard,
    }, */
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: SetGlobalLogContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: SetTraceContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: SetClientContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LogRequestStartInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalErrorFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SetTenantContextMiddleware, AzureIdpAuthMiddleware).forRoutes('*');
  }
}
