import {CoreModule} from 'src/core/core.module';
import {EmailNotificationModule} from 'src/modules/emailNotification/emailNotification.module';
import {Module} from '@nestjs/common';
import {ReportSenderService} from './reportSender.service';
import {HistoricalReportModule} from 'src/modules/historicalReport/historicalReport.module';
import {NotificationSenderModule} from '../notificationSender/notificationSenderModule.module';

@Module({
  imports: [EmailNotificationModule, CoreModule, HistoricalReportModule, NotificationSenderModule],
  providers: [ReportSenderService],
  controllers: [],
  exports: [],
})
export class ReportSenderModule {}
