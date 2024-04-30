import {Injectable} from '@nestjs/common';

import {PlainObject} from 'src/modules/common/common.dto';
import {MMMHubTransactionalSendEvents} from '../scheduledJobs/notificationSender/mmmHub/mmmHub.type';
import {NotificationEventType} from '../sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/notificationEventType.enum';
import {EmailLogStatus} from '../status/status.enum';
import {Tenant} from '../tenant/tenant.entity';
import {TenantService} from '../tenant/tenant.service';
import {TenantUserInvitationService} from '../tenantUserInvitation/tenantUserInvitation.service';
import {MMMHubEmailCallbackDto} from '../notification/dto/mmmHubEmailCallback.dto';

import {EmailLog} from './emailLog.entity';
import {EmailLogRepository} from './emailLog.repository';
import {Logger} from '../../core/logger';

@Injectable()
export class EmailLogService {
  constructor(
    private readonly emailLogRepository: EmailLogRepository,
    private readonly tenantService: TenantService,
    private readonly tenantUserInvitationService: TenantUserInvitationService,
    private readonly logger: Logger,
  ) {}

  /**
   * Create a new EmailLog record
   *
   * @param {PlainObject} data - The data which has to be used to create the new record
   * @returns {Promise<EmailLog>} - A simple promise to ensure that the record has been created
   */
  public async create(data: PlainObject): Promise<EmailLog> {
    const emailLog = new EmailLog(data);
    return this.emailLogRepository.save(emailLog);
  }

  /**
   * Obtain information from MMM Hub regarding the status of the email which was sent thought their API
   *
   * @param {EmailLog} emailLog - The EmailLog record containing details for the event
   */
  public processEmailLogStatus(emailLog: EmailLog, eventData: MMMHubEmailCallbackDto): void {
    const emailLogPatchData: Partial<EmailLog> = {
      response: eventData,
    };

    if (eventData.eventCategoryType === MMMHubTransactionalSendEvents.EmailSent) {
      emailLogPatchData.status = EmailLogStatus.Successful;
      this.logger.info(__filename, 'MMMHubEmailSuccess', eventData);
    } else if (
      eventData.eventCategoryType === MMMHubTransactionalSendEvents.EmailNotSent ||
      eventData.eventCategoryType === MMMHubTransactionalSendEvents.EmailBounced
    ) {
      emailLogPatchData.status = EmailLogStatus.Failed;
      this.logger.info(__filename, 'MMMHubEmailFailure', eventData);
      this.processFailedEmail(emailLog);
    }

    this.update(emailLog, emailLogPatchData);
  }

  /**
   * Add some additional processing for the failed emails send to MMM Hub
   * @param emailLog
   */
  private processFailedEmail = (emailLog: EmailLog) => {
    emailLog.request.recipients.forEach((recipient) => {
      switch (recipient.attributes.EventType) {
        case NotificationEventType.AdminInvited:
        case NotificationEventType.UserInvited:
          this.processFailedInvitationEmail(emailLog);
          break;
        default:
          break;
      }
    });
  };

  /**
   * Process the failed invitation emails and apply some updates to our DB in order to disable the invitation
   * and show the correct status of the user
   *
   * @param {EmailLog} emailLog
   */
  private processFailedInvitationEmail(emailLog: EmailLog): void {
    emailLog.request.recipients.forEach(async (recipient) => {
      const email: string = recipient.to;
      const tenant: Tenant = await this.tenantService.getByBrandAndCountry(
        recipient.attributes.Brand,
        recipient.attributes.Country,
      );

      this.tenantUserInvitationService.discardInvitation(tenant.id, email);
    }, '');
  }

  /**
   * Update a specific EmailLog details
   *
   * @param {EmailLog} emailLog - The EmailLog record which has to be updated
   * @param {Partial<EmailLog>} data - The data which has to be used to update the new record
   * @returns {Promise<EmailLog>} - A simple promise to ensure that the record has been updated
   */
  public async update(emailLog: EmailLog, data: Partial<EmailLog>): Promise<EmailLog> {
    emailLog.response = data.response;
    emailLog.status = data.status;

    return this.emailLogRepository.save(emailLog);
  }
}
