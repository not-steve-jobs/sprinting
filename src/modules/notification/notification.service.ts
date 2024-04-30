import {Injectable} from '@nestjs/common';
import {Pagination, PaginationOptions} from '../common/paginate';
import {NotificationRepository} from './notification.repository';
import {Notification} from './notification.entity';
import {NotificationError} from './notification.error';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {EmailLogRepository} from '../emailLog/emailLog.repository';
import {EmailLogService} from '../emailLog/emailLog.service';
import {MMMHubEmailCallbackDto} from './dto/mmmHubEmailCallback.dto';
import {Logger} from '../../core/logger';
import crypto from 'crypto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly appConfig: AppConfigService,
    private readonly emailLogRepository: EmailLogRepository,
    private readonly emailLogService: EmailLogService,
    private readonly logger: Logger,
  ) {}

  async fetchNotifications(
    tenantId: number,
    paginatorOptions: PaginationOptions,
    userId: string,
  ): Promise<Pagination<Notification>> {
    try {
      return await this.notificationRepository.fetchNotifications(tenantId, userId, paginatorOptions);
    } catch (error) {
      throw new NotificationError.NotificationFetchError(null, error);
    }
  }

  /**
   * Simply request the repository to save a new notification entity
   *
   * @param {Notification} notification - The new entity which should be saved in the database
   * @returns {Promise<Notification>} - Promise with the entity which was saved in the database
   */
  async save(notification: Notification): Promise<Notification> {
    try {
      return await this.notificationRepository.save(notification);
    } catch (error) {
      throw new NotificationError.NotificationSaveError(null, error);
    }
  }

  async saveMany(notifications: Notification[]): Promise<Notification[]> {
    try {
      return await this.notificationRepository.saveMany(notifications);
    } catch (error) {
      throw new NotificationError.NotificationSaveManyError(null, error);
    }
  }

  /**
   * Mark a specific Notification as read
   *
   * @param {number} tenantId - The ID of the Tenant linked with the Notification
   * @param {string} notificationId - The ID of the Notification which we want to read
   * @returns {Promise<Notification>} - Updated details for the Notifications
   */
  async readNotification(tenantId: number, notificationId: string): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne(tenantId, notificationId);
      if (notification && !notification.isRead) {
        return await this.notificationRepository.save(new Notification({...notification, isRead: true}));
      } else {
        return notification;
      }
    } catch (error) {
      throw new NotificationError.NotificationReadError(null, error);
    }
  }

  /**
   * Mark the Notifications related with a specific Case as read
   *
   * @param {number} tenantId - The ID of Tenant which we want the notification to belong to
   * @param {string} caseId - The ID of the Case we want to query
   * @param {string} userId - The ID of the User we want the notification to belong to
   * @returns {Promise<Notification[]>} - Updated details for the Notifications
   */
  async readCaseNotifications(tenantId: number, caseId: string, userId: string): Promise<Notification[]> {
    try {
      const notifications: Notification[] = await this.notificationRepository.findByCaseId(tenantId, caseId, userId);

      return Promise.all(
        notifications.map(async (notification: Notification) => {
          if (!notification.isRead) {
            return await this.notificationRepository.save(new Notification({...notification, isRead: true}));
          } else {
            return notification;
          }
        }),
      );
    } catch (error) {
      throw new NotificationError.NotificationReadError(null, error);
    }
  }

  async readAllUserNotification(tenantId: number, userId: string): Promise<{allNotificationsRead: boolean}> {
    try {
      const notificationToUpdate = new Notification({
        tenantId,
        userId,
        isRead: false,
      });
      await this.notificationRepository.update(notificationToUpdate, {isRead: true});
      return {allNotificationsRead: true};
    } catch (error) {
      throw new NotificationError.NotificationReadError(null, error);
    }
  }

  verifyMMMHubSignature(header: string, payload: object) {
    const key = this.appConfig.mmmHubEventCallbackConfig.key;

    if (!key) {
      this.logger.info(__filename, 'Missing key for verification of mmmHubEventCallback');
      return true;
    }

    const hmac = crypto.createHmac('sha256', Buffer.from(key, 'base64'));
    const data = hmac.update(JSON.stringify(payload));
    const result = data.digest('base64');

    return result === header;
  }

  async proceedEmailEvent(eventData: MMMHubEmailCallbackDto) {
    const emailLog = await this.emailLogRepository.findOneByMessageKey(eventData.info.messageKey);

    if (emailLog) {
      this.emailLogService.processEmailLogStatus(emailLog, eventData);
    } else {
      // NOTE: In MMM Hub, DEV, TEST and UAT all target the same Salesforce Marketing Cloud instance.
      //       For this reason, we will receive events for all 3 environments on each of our environments.
      //       Therefore, not finding an EmailLog in those environments is not an error.
      //       In PROD, this **is** an application error!
      if (this.appConfig.envPrefix === 'p') {
        this.logger.error(
          __filename,
          `EmailLogNotFound: Received event for messageKey ${eventData.info.messageKey}, but matching EmailLog was not found.`,
        );
      } else {
        this.logger.info(
          __filename,
          `EmailLogNotFound: EmailLog for messageKey ${eventData.info.messageKey} not found. Either the event did not target this environment or something went wrong.`,
        );
      }
    }
  }
}
