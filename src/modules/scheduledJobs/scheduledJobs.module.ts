import {Module} from '@nestjs/common';
import {checkTenantUserInvitationExpirationTriggerModule} from './checkTenantUserInvitationExpirationTrigger/checkTenantUserInvitationExpirationTrigger.module';
import {NotificationSenderModule} from './notificationSender/notificationSenderModule.module';
import {ReportSenderModule} from './reportSender/reportSender.module';

@Module({
  imports: [checkTenantUserInvitationExpirationTriggerModule, NotificationSenderModule, ReportSenderModule],
  providers: [],
  controllers: [],
  exports: [],
})
export class ScheduledJobsModule {}
