import {forwardRef, Module} from '@nestjs/common';

import {CoreModule} from 'src/core/core.module';
import {QueueModule} from 'src/modules/queue/queue.module';
import {EmailNotificationModule} from 'src/modules/emailNotification/emailNotification.module';
import {EmailLogModule} from 'src/modules/emailLog/emailLog.module';

import {EmailNotificationWorkerService} from './emailNotificationWorker.service';
import {SendgridNotificationSender} from './sendgridNotificationSender.service';
import {MMMHubNotificationSender} from './mmmHub/mmmHubNotificationSender.service';
import {CustomHttpModule} from '../../customHttp/customHttp.module';

@Module({
  imports: [CoreModule, CustomHttpModule, QueueModule, EmailNotificationModule, forwardRef(() => EmailLogModule)],
  providers: [SendgridNotificationSender, MMMHubNotificationSender, EmailNotificationWorkerService],
  controllers: [],
  exports: [SendgridNotificationSender, MMMHubNotificationSender],
})
export class NotificationSenderModule {}
