import {Injectable} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {Logger} from 'src/core/logger';
import {runWithAdvisoryLock, LockType} from 'src/helpers/concurrency.helper';
import {EmailNotificationType} from 'src/modules/emailNotification/emailNotification.enum';
import {EmailNotificationService} from 'src/modules/emailNotification/emailNotification.service';
import {HistoricalReportService} from '../../historicalReport/historicalReport.service';
import {SendgridNotificationSender} from '../notificationSender/sendgridNotificationSender.service';
import * as dateFns from 'date-fns';

@Injectable()
export class ReportSenderService {
  constructor(
    private readonly service: HistoricalReportService,
    private notificationSender: SendgridNotificationSender,
    private readonly appConfig: AppConfigService,
    private readonly emailNotificationService: EmailNotificationService,
    private readonly logger: Logger,
  ) {}

  private async isReportSent(reportType: EmailNotificationType): Promise<boolean> {
    let from = new Date();
    let to = new Date();

    switch (reportType) {
      case EmailNotificationType.GeneralReport:
      case EmailNotificationType.NPSReportGenerated:
      case EmailNotificationType.CasesReportGenerated:
        from = dateFns.startOfMonth(new Date());
        to = dateFns.endOfMonth(new Date());
        break;
      default:
        break;
    }

    const notification = await this.emailNotificationService.isReportSent(reportType, from, to);

    if (notification) {
      this.logger.info(__filename, `Skip sending report notification. Report already sent`, {
        entity: 'EmailNotification',
        id: notification.id,
        type: notification.type,
      });
    }
    return !!notification;
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async process() {
    await runWithAdvisoryLock(LockType.GeneralReport, async () => {
      const reportType = EmailNotificationType.GeneralReport;

      if (await this.isReportSent(reportType)) return Promise.resolve();

      const csvReport = await this.service.getHistoricalUsersReportCsv();
      await this.notificationSender.sendMailWithAttachment(
        this.appConfig.reportSenderConfig.destinationEmail,
        'New report generated',
        'Report attached',
        'Report attached',
        'report.csv',
        'text/csv',
        Buffer.from(csvReport).toString('base64'),
        {type: reportType},
      );
      this.logger.info(__filename, `Report notification sent: ${reportType}`);
    });
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async processNpsReport() {
    await runWithAdvisoryLock(LockType.NPSReport, async () => {
      const reportType = EmailNotificationType.NPSReportGenerated;

      if (await this.isReportSent(reportType)) return Promise.resolve();

      const csvReport = await this.service.getNpsReportCsv();
      await this.notificationSender.sendMailWithAttachment(
        this.appConfig.reportSenderConfig.destinationEmail,
        'New NPS report generated',
        'Report attached',
        'Report attached',
        'npsReport.csv',
        'text/csv',
        Buffer.from(csvReport).toString('base64'),
        {type: EmailNotificationType.NPSReportGenerated},
      );

      this.logger.info(__filename, `Report notification sent: ${reportType}`);
    });
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async sendCommunicationCasesReport() {
    await runWithAdvisoryLock(LockType.CasesReport, async () => {
      const reportType = EmailNotificationType.CasesReportGenerated;

      if (await this.isReportSent(reportType)) return Promise.resolve();

      const csvReport = await this.service.getCommunicationCasesReportCsv();
      await this.notificationSender.sendMailWithAttachment(
        this.appConfig.reportSenderConfig.destinationEmail,
        'New cases report generated',
        'Report attached',
        'Report attached',
        'cases-report.csv',
        'text/csv',
        Buffer.from(csvReport).toString('base64'),
        {type: EmailNotificationType.CasesReportGenerated},
      );

      this.logger.info(__filename, `Report notification sent: ${reportType}`);
    });
  }
}
