import {Inject, Injectable} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';

import {AppConfigService} from 'src/core/config/appConfig.service';
import {QueueReceiverName} from 'src/modules/queue/queue.module';
import {QueueReceiver} from 'src/modules/queue/queueReceiver.interface';
import {EMAIL_MESSAGE_QUEUE_NAME} from 'src/modules/queue/queue.constants';
import {QueueMessage} from 'src/modules/sendBackgroundNotification/queueMessage.interface';
import {BackgroundNotificationType} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotificationType.enum';
import {EmailNotificationService} from 'src/modules/emailNotification/emailNotification.service';
import {Logger} from '../../../core/logger';

import {SendgridNotificationSender} from './sendgridNotificationSender.service';
import {MailProvider} from './emailNotification.enum';
import {MMMHubNotificationSender} from './mmmHub/mmmHubNotificationSender.service';
import {BaseMmmHubEmailMessage, SendEmailResponse} from './mmmHub/mmmHub.type';
import {LockType, runWithAdvisoryLock} from 'src/helpers/concurrency.helper';

function isQueueMessage(message: unknown): message is QueueMessage {
  return !!(
    message['messageType'] &&
    message['notificationType'] &&
    message['contentType'] &&
    message['to'] &&
    message['content']
  );
}

function parseJson(text: string): [boolean, {[key: string]: unknown}] {
  try {
    const parsed = JSON.parse(text);
    return [true, parsed];
  } catch {
    return [false, undefined];
  }
}

@Injectable()
export class EmailNotificationWorkerService {
  constructor(
    @Inject(QueueReceiverName) private consumer: QueueReceiver<unknown>,
    private sendgridNotificationSender: SendgridNotificationSender,
    private mmmHubNotificationSender: MMMHubNotificationSender,
    private readonly appConfig: AppConfigService,
    private readonly emailNotificationService: EmailNotificationService,
    private readonly logger: Logger,
  ) {}

  /**
   * Process the Email Queue and send command to Sendgrid to send the emails
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async processData() {
    const queueName = EMAIL_MESSAGE_QUEUE_NAME;
    let received = await this.consumer.receiveMessage(queueName);
    while (received) {
      const [message, metadata] = received;
      const [parsed, parsedMessage] = parseJson(message);
      if (!parsed) {
        this.logger.error(__filename, 'A message from the queue could not be parsed as JSON.');
        await this.consumer.notifyErroredMessage(queueName, metadata);
      } else {
        if (isQueueMessage(parsedMessage) && parsedMessage.notificationType === BackgroundNotificationType.Email) {
          if (parsedMessage.provider === MailProvider.MMMHub) {
            this.processMmmHubEmails(queueName, parsedMessage, metadata);
          } else {
            this.processSendgridEmails(queueName, parsedMessage, metadata);
          }
        } else {
          this.logger.error(__filename, 'The received message cannot be handled.');
          this.consumer.notifyErroredMessage(queueName, metadata);
        }
      }
      received = await this.consumer.receiveMessage(queueName);
    }
  }

  /**
   * Process the scheduled emails in the database multiple times a day
   * It will send only the jobs which are pending and match the scheduled date
   *
   * NOTE: For now it's scheduled to be executed once an hour because the notifications
   * are timezone dependant and we can't do this ony once a day. Also this way we can
   * split the execution to a separate batches and limit the number of the processed notifications
   */
  @Cron(CronExpression.EVERY_HOUR)
  async processScheduled() {
    await runWithAdvisoryLock(LockType.DueEmailNotifications, async () => {
      this.logger.info(__filename, 'Process daily newsletter.');
      await this.emailNotificationService.processEmailNotifications();
      this.logger.info(__filename, 'Finished with the processing of the daily newsletter.');
    });
  }

  /**
   * Delegate a new request to MMM Hub with command to send new email with a specific content
   *
   * @param {string} queueName - The MailQueue provider of the message
   * @param {QueueMessage} message - The command which was read from the MailQueue with info for the email
   * @param {any} metadata - Currently we don't support metadata yet so it will be always null
   */
  private async processMmmHubEmails(queueName: string, message: QueueMessage, metadata: any): Promise<void> {
    try {
      await this.mmmHubNotificationSender
        .sendEmail(message.content as BaseMmmHubEmailMessage<any>)
        .then((response: SendEmailResponse) => {
          // First, check whether the request was sent successfully and made it to the destination
          if (this.mmmHubNotificationSender.isFailedResponse(response)) {
            this.logger.error(
              __filename,
              `Could not send email message with MMM Hub. Request failed with Status Code: ${response.status}. Message: ${response.message}`,
            );
            this.consumer.notifyErroredMessage(queueName, metadata);
          } else {
            setTimeout(() => {
              if (response.responses && response.responses.length) {
                // Verify the status of the sent requests, because it can reach the destination but fail because of wrong data
                this.mmmHubNotificationSender
                  .checkEmailSendStatus(response.responses[0].messageKey)
                  .then((statusResponse) => {
                    if (this.mmmHubNotificationSender.isFailedResponse(statusResponse)) {
                      this.logger.error(
                        __filename,
                        `Could not send email message with MMM Hub. Request status check failed with Message: ${statusResponse.message}`,
                      );
                      this.consumer.notifyErroredMessage(queueName, metadata);
                    } else {
                      // Note: Optionally save the status of the response in the EmailLog
                      // Although it's not required because we'll obtain it in the next cron tick anyway
                      this.logger.error(__filename, `Successfully sent email message with MMM Hub provider.`);
                      this.consumer.notifyCompleteMessage(queueName, metadata);
                    }
                  });
              } else {
                this.logger.error(
                  __filename,
                  `Could not send email message with MMM Hub. Request status check failed with Message: ${response}`,
                );
                this.consumer.notifyErroredMessage(queueName, metadata);
              }
            }, 10000);
          }
        });
    } catch (exception) {
      this.logger.error(__filename, `Could not send email message with MMM Hub: Error: ${exception.message}`);
      this.consumer.notifyErroredMessage(queueName, metadata);
    }
  }

  /**
   * Delegate a new request to Sendgrid with command to send new email with a specific content
   * NOTE: This method should be deprecated and removed once we turn off the Sendgrid Service
   *
   * @param {string} queueName - The MailQueue provider of the message
   * @param {QueueMessage} message - The command which was read from the MailQueue with info for the email
   * @param {any} metadata - Currently we don't support metadata yet so it will be always null
   */
  private processSendgridEmails(queueName: string, message: QueueMessage, metadata: any): void {
    try {
      const templateData = this.appConfig.mailTemplates.find((template) => template.name === message.eventTemplateType);

      if (templateData) {
        this.sendgridNotificationSender.sendMailWithTemplate(message.to, templateData.id, message.content);
        this.consumer.notifyCompleteMessage(queueName, metadata);
      } else {
        this.logger.error(__filename, `Template for ${message.eventTemplateType} not found.`);
        this.consumer.notifyErroredMessage(queueName, metadata);
      }
    } catch {
      this.logger.error(__filename, 'Could not send the message');
      this.consumer.notifyErroredMessage(queueName, metadata);
    }
  }
}
