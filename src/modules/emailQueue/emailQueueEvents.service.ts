import {ServiceBusClient, ProcessErrorArgs, ServiceBusReceiver, ServiceBusReceivedMessage} from '@azure/service-bus';
import {AppConfigService} from '../../core/config/appConfig.service';
import {Injectable} from '@nestjs/common';
import {Logger} from '../../core/logger';
import {BackgroundNotificationType} from '../sendBackgroundNotification/backgroundNotification/backgroundNotificationType.enum';
import {MailProvider} from '../scheduledJobs/notificationSender/emailNotification.enum';
import {MMMHubNotificationSender} from '../scheduledJobs/notificationSender/mmmHub/mmmHubNotificationSender.service';
import {SendgridNotificationSender} from '../scheduledJobs/notificationSender/sendgridNotificationSender.service';
import {BaseMmmHubEmailMessage, SendEmailResponse} from '../scheduledJobs/notificationSender/mmmHub/mmmHub.type';
import {QueueMessage} from '../sendBackgroundNotification/queueMessage.interface';

function isQueueMessage(message: unknown): message is QueueMessage {
  return !!(
    message['messageType'] &&
    message['notificationType'] &&
    message['contentType'] &&
    message['to'] &&
    message['content']
  );
}

@Injectable()
export class EmailQueueEventsService {
  private started: boolean = false;
  private receiver: ServiceBusReceiver = null;

  public constructor(
    private readonly appConfigService: AppConfigService,
    private readonly logger: Logger,
    private sendgridNotificationSender: SendgridNotificationSender,
    private mmmHubNotificationSender: MMMHubNotificationSender,
  ) {}

  public async start() {
    if (this.started) return;

    const {enabled, connectionString, queueName} = this.appConfigService.emailQueue;

    if (!enabled) {
      this.logger.info(__filename, `Email queue is disabled`);
      return;
    } else {
      this.logger.info(__filename, `Email queue is enabled`);
    }

    try {
      const serviceBusClient = new ServiceBusClient(connectionString);
      this.receiver = serviceBusClient.createReceiver(queueName, {
        receiveMode: 'peekLock',
      });
      this.receiver.subscribe(
        {processMessage: this.onMessage, processError: this.onError},
        {autoCompleteMessages: false},
      );
    } catch (e) {
      this.logger.error(__filename, 'Email Queue Events error:', e.message);
    }

    this.started = true;
  }

  private parseJson(text: string): [boolean, {[key: string]: unknown}] {
    try {
      const parsed = JSON.parse(text);
      return [true, parsed];
    } catch {
      return [false, undefined];
    }
  }

  private async processMmmHubEmails(message: QueueMessage): Promise<boolean> {
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
            return false;
          }

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
                    return false;
                  } else {
                    // Note: Optionally save the status of the response in the EmailLog
                    // Although it's not required because we'll obtain it in the next cron tick anyway
                    this.logger.info(__filename, `Successfully sent email message with MMM Hub provider.`);
                  }
                });
            } else {
              this.logger.error(
                __filename,
                `Could not send email message with MMM Hub. Request status check failed with Message: ${response}`,
              );
              return false;
            }
          }, 10000);
        });
    } catch (exception) {
      this.logger.error(__filename, `Could not send email message with MMM Hub: Error: ${exception.message}`);
      return false;
    }

    return true;
  }

  private processSendgridEmails(message: QueueMessage): boolean {
    try {
      const templateData = this.appConfigService.mailTemplates.find(
        (template) => template.name === message.eventTemplateType,
      );

      if (templateData) {
        this.sendgridNotificationSender.sendMailWithTemplate(message.to, templateData.id, message.content);
      } else {
        this.logger.error(__filename, `Template for ${message.eventTemplateType} not found.`);
        return false;
      }
    } catch {
      this.logger.error(__filename, 'Could not send the message');
      return false;
    }

    return true;
  }

  private onMessage = async (message: ServiceBusReceivedMessage) => {
    const messageJson = message.body;
    const [parsed, parsedMessage] = this.parseJson(messageJson);
    let complete: boolean = false;
    if (!parsed) {
      this.logger.error(__filename, 'A message from the queue could not be parsed as JSON.');
      this.receiver.abandonMessage(message);
    } else {
      if (isQueueMessage(parsedMessage) && parsedMessage.notificationType === BackgroundNotificationType.Email) {
        if (parsedMessage.provider === MailProvider.MMMHub) {
          complete = await this.processMmmHubEmails(parsedMessage);
        } else {
          complete = this.processSendgridEmails(parsedMessage);
        }
      } else {
        this.logger.error(__filename, 'The received message cannot be handled.');
        this.receiver.abandonMessage(message);
      }
    }

    this.logger.info(__filename, `Email Queue Event: Message: ${JSON.stringify(message, null, 4)}`);
    if (complete) {
      this.receiver.completeMessage(message);
    } else {
      this.receiver.abandonMessage(message);
    }
  };

  private onError = async ({error}: ProcessErrorArgs) => {
    let match;
    if ((match = error.message?.match(/The messaging entity (.*) could not be found./))) {
      this.logger.error(__filename, `Couldn't connect to ${match[1]}`, error);
    } else {
      this.logger.error(
        __filename,
        `Email Queue Event: Unhandled error while processing message ${error.message} ${error.stack}`,
        error,
      );
    }
  };

  public async sendMessage(message: string) {
    const {enabled} = this.appConfigService.emailQueue;
    if (!enabled) {
      return;
    }
    const connectionString = this.appConfigService.emailQueue.connectionString;

    const sendObject = {
      body: message,
    };

    const queueName = this.appConfigService.emailQueue.queueName;
    const serviceBusClient = new ServiceBusClient(connectionString);
    const sender = serviceBusClient.createSender(queueName);

    try {
      await sender.sendMessages(sendObject);
    } catch (e) {
      this.logger.info(__filename, `Send email to queue: Error for ${queueName}: ${e}`);
    }
  }
}
