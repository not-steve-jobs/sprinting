import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {CoreModule} from 'src/core/core.module';
import {NotificationSenderModule} from '../scheduledJobs/notificationSender/notificationSenderModule.module';
import {TenantModule} from '../tenant/tenant.module';
import {TenantUserInvitationModule} from '../tenantUserInvitation/tenantUserInvitation.module';

import {EmailLogRepository} from './emailLog.repository';
import {EmailLogService} from './emailLog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLogRepository]),
    CoreModule,
    TenantModule,
    TenantUserInvitationModule,
    forwardRef(() => NotificationSenderModule),
  ],
  controllers: [],
  providers: [EmailLogService],
  exports: [EmailLogService],
})
export class EmailLogModule {}
