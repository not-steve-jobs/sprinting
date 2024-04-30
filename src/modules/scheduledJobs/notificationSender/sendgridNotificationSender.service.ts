import {Injectable, Logger} from '@nestjs/common';
import {MailService} from '@sendgrid/mail';
import {Client} from '@sendgrid/client';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {ClientRequest} from '@sendgrid/client/src/request';
import {EmailNotificationService} from 'src/modules/emailNotification/emailNotification.service';
import {EmailNotificationType} from 'src/modules/emailNotification/emailNotification.enum';
import {EmailNotificationStatus} from 'src/modules/status/status.enum';

/**
 * TODO: This service is deprecated and should be removed once we turn it off
 */
@Injectable()
export class SendgridNotificationSender {
  private logger: Logger = new Logger(__filename);

  private readonly mailService: MailService;
  private readonly sendgridClient: Client;
  private readonly fromEmailAddress: string;

  constructor(
    private readonly appConfig: AppConfigService,
    private readonly emailNotificationService: EmailNotificationService,
  ) {
    const sendGridApiKey = appConfig.notificationSenderConfig.sendgridApiKey;
    this.mailService = new MailService();
    this.mailService.setApiKey(sendGridApiKey);

    this.sendgridClient = new Client();
    this.sendgridClient.setApiKey(sendGridApiKey);

    this.fromEmailAddress = appConfig.notificationSenderConfig.verifiedEmailUsedToSendMails;
  }

  async sendMail(toEmailAddress: string, subject: string, text: string, html: string) {
    const msg = {
      to: toEmailAddress, // Change to your recipient
      from: this.fromEmailAddress,
      subject: subject,
      text: text,
      html: html,
    };

    try {
      await this.mailService.send(msg);
    } catch (error) {
      this.logger.error(
        `An error occurred while sending a mail to: ${toEmailAddress} subject: ${subject}. Error: ${error}`,
      );
      if (error.response) {
        this.logger.error(error.response.body);
      }
    }
  }

  async sendMailWithAttachment(
    toEmailAddress: string,
    subject: string,
    text: string,
    html: string,
    attachmentFileName: string,
    attachmentContentType: string,
    attachmentContent: string,
    additionalPayload?: {type: string},
  ) {
    const msg = {
      to: toEmailAddress,
      from: this.fromEmailAddress,
      subject: subject,
      text: text,
      html: html,
      attachments: [
        {
          content: attachmentContent,
          filename: attachmentFileName,
          type: attachmentContentType,
          disposition: 'attachment',
        },
      ],
    };

    try {
      await this.mailService.send(msg);

      // create log that mail was sent
      await this.emailNotificationService.create({
        email: toEmailAddress,
        type: additionalPayload?.type ?? EmailNotificationType.GeneralType,
        payload: {subject, ...(additionalPayload || {})},
        sendDate: new Date(),
        status: EmailNotificationStatus.Sent,
      });
    } catch (error) {
      this.logger.error(
        `An error occurred while sending a mail to: ${toEmailAddress} subject: ${subject}. Error: ${error}`,
      );
      if (error.response) {
        this.logger.error(error.response.body);
      }
    }
  }

  async sendMailWithTemplate(toEmailAddresses: string[], templateId: string, templateParametersKeyValuesObject: any) {
    try {
      const bodyToSend = this.createBodyForTemplateEmail(
        toEmailAddresses,
        this.fromEmailAddress,
        templateId,
        templateParametersKeyValuesObject,
      );

      const request = {
        body: bodyToSend,
        method: 'POST',
        url: '/v3/mail/send',
      };

      await this.sendgridClient.request(request as ClientRequest);
    } catch (error) {
      this.logger.error(
        `An error occurred while sending a mail to: ${toEmailAddresses}. Email templateId: ${templateId}. Error: ${error}.`,
      );
      if (error.response) {
        this.logger.error(error.response.body);
      }
    }
  }

  private createBodyForTemplateEmail(
    emailsToSend: string[],
    emailFrom: string,
    templateId: string,
    templateParametersKeyValuesObject: any,
  ): any {
    return {
      personalizations: [
        {
          to: emailsToSend.map((email) => {
            const emailObj = {};
            emailObj['email'] = email;
            return emailObj;
          }),
          dynamic_template_data: templateParametersKeyValuesObject,
        },
      ],
      from: {
        email: emailFrom,
      },
      template_id: templateId,
    };
  }
}
