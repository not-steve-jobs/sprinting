import {BackgroundNotificationModule} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotification.module';
import {GoogleApiModule} from 'src/modules/googleApi/googleApi.module';
import {EmailQueueEventsService} from './emailQueueEvents.service';
import {CoreModule} from 'src/core/core.module';
import {Module} from '@nestjs/common';
import {NotificationSenderModule} from '../scheduledJobs/notificationSender/notificationSenderModule.module';

@Module({
  imports: [
    CoreModule, // required for auth decorator
    BackgroundNotificationModule,
    GoogleApiModule,
    NotificationSenderModule,
  ],
  providers: [EmailQueueEventsService],
  controllers: [],
  exports: [],
})
export class EmailQueueModule {}
