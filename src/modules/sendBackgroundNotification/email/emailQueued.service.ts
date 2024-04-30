import {Inject, Injectable} from '@nestjs/common';

import {QueueSender} from 'src/modules/queue/queueSender.interface';
import {QueueSenderName} from 'src/modules/queue/queue.module';
import {EMAIL_MESSAGE_QUEUE_NAME} from 'src/modules/queue/queue.constants';
import {QueueMessage} from 'src/modules/sendBackgroundNotification/queueMessage.interface';
import {ContentType} from 'src/modules/sendBackgroundNotification/contentType.enum';
import {MessageType} from 'src/modules/sendBackgroundNotification/messageType.enum';
import {BackgroundNotificationType} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotificationType.enum';
import {MailProvider} from 'src/modules/scheduledJobs/notificationSender/emailNotification.enum';

import {EmailSender} from './emailSender.interface';
import {EmailMessage} from './emailMessage.interface';
import {Logger} from 'src/core/logger';

@Injectable()
export class EmailQueuedService implements EmailSender {
  constructor(@Inject(QueueSenderName) private sender: QueueSender, private readonly logger: Logger) {}

  /**
   * Add a new message to the Mail Queue so it can be send when processed on the next tick
   *
   * @param {EmailMessage} message - Contains info for the email message which has to be send
   * @returns {Promise<void>} - A simple promise to ensure that the message has been added to the queue
   */
  public async sendMail(message: EmailMessage): Promise<void> {
    const qMsg: QueueMessage = {
      messageType: MessageType.Demo,
      provider: message.provider ?? MailProvider.Sendgrid, // TODO: Temporary added as a fallback for Sendgrid until we migrate all of the email templates
      notificationType: BackgroundNotificationType.Email,
      contentType: ContentType.Templated,
      eventTemplateType: message.notificationType,
      to: message.to,
      content: message.notificationContent,
    };

    this.logger.info(
      __filename,
      `EmailQueuedService> sending ${qMsg.eventTemplateType} to ${qMsg.to} through ${qMsg.provider}`,
    );
    return this.sender.sendMessage(EMAIL_MESSAGE_QUEUE_NAME, JSON.stringify(qMsg));
  }
}
