import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {FeatureConfigurationRepository} from '../featureConfiguration/featureConfiguration.repository';
import {JwtHelper} from '../../helpers/jwt.helper';
import {ContextService} from '../../core/context/context.service';
import {TenantUserInvitationModule} from '../tenantUserInvitation/tenantUserInvitation.module';
import {EmailLogRepository} from '../emailLog/emailLog.repository';
import {TenantModule} from '../tenant/tenant.module';
import {EmailLogService} from '../emailLog/emailLog.service';
import {NotificationController} from './notification.controller';
import {NotificationService} from './notification.service';
import {NotificationRepository} from './notification.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationRepository, FeatureConfigurationRepository, EmailLogRepository]),
    CoreModule,
    TenantModule,
    forwardRef(() => TenantUserInvitationModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, JwtHelper, ContextService, EmailLogService],
  exports: [NotificationService],
})
export class NotificationModule {}
