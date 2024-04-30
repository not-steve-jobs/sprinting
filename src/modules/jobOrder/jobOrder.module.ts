import {CloseReasonModule} from './../closeReason/closeReason.module';
import {AamBackendModule} from './../aamBackend/aamBackend.module';
import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from 'src/core/core.module';
import {AzureStorageHelper} from 'src/helpers/azure.storage.helper';
import {JobOrderAssociateRepository} from 'src/modules/jobOrderAssociate/jobOrderAssociate.repository';
import {JobOrderLanguageRepository} from '../jobOrderLanguage/jobOrderLanguage.repository';
import {BackgroundNotificationModule} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotification.module';
import {FileModule} from 'src/modules/file/file.module';
import {InfoSystemModule} from 'src/modules/integrations/infoSystem/infoSystem.module';
import {PersonModule} from 'src/modules/person/person.module';
import {EmailNotificationModule} from 'src/modules/emailNotification/emailNotification.module';
import {JobOrderService} from './jobOrder.service';
import {JobOrderController} from './jobOrder.controller';
import {JobOrderRepository} from './jobOrder.repository';
import {JobOrderNotificationsService} from './jobOrderNotifications.service';
import {CloseReasonArgumentsModule} from '../closeReasonArguments/closeReasonArguments.module';
import {AuditLogModule} from '../auditLog/auditLog.module';
import {UserProfileModule} from '../userProfile/userProfile.module';
import {JobOrderAuditLogService} from './jobOrderAuditLog.service';
import {ServiceTypeModule} from '../serviceType/serviceType.module';
import {StatusModule} from '../status/status.module';
import {FeatureConfigurationModule} from '../featureConfiguration/featureConfiguration.module';
import {TenantRepository} from '../tenant/tenant.repository';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {SalesForceModule} from '../integrations/salesForce/salesForce.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobOrderRepository,
      JobOrderAssociateRepository,
      JobOrderLanguageRepository,
      TenantRepository,
      TenantUserRepository,
    ]),
    CoreModule,
    BackgroundNotificationModule,
    FileModule,
    PersonModule,
    AamBackendModule,
    CloseReasonModule,
    CloseReasonArgumentsModule,
    AuditLogModule,
    ServiceTypeModule,
    StatusModule,
    FeatureConfigurationModule,
    forwardRef(() => InfoSystemModule),
    forwardRef(() => SalesForceModule),
    forwardRef(() => EmailNotificationModule),
    forwardRef(() => UserProfileModule),
  ],
  controllers: [JobOrderController],
  providers: [JobOrderService, JobOrderNotificationsService, JobOrderAuditLogService, AzureStorageHelper],
  exports: [JobOrderService, JobOrderNotificationsService],
})
export class JobOrderModule {}
