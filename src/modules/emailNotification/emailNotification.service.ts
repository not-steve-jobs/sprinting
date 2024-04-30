import {forwardRef, Inject, Injectable} from '@nestjs/common';

import {PlainObject} from 'src/modules/common/common.dto';
import {JobOrderNotificationsService} from 'src/modules/jobOrder/jobOrderNotifications.service';
import {EmailNotificationStatus} from 'src/modules/status/status.enum';

import {EmailNotification} from './emailNotification.entity';
import {EmailNotificationType} from './emailNotification.enum';
import {EmailNotificationRepository} from './emailNotification.repository';

@Injectable()
export class EmailNotificationService {
  constructor(
    private readonly emailNotificationRepository: EmailNotificationRepository,
    @Inject(forwardRef(() => JobOrderNotificationsService))
    private readonly jobOrderNotificationService: JobOrderNotificationsService,
  ) {}

  /**
   * Process all Pending notification from the database which are due to be send
   */
  public async processEmailNotifications(): Promise<void> {
    const pendingEmailNotifications: EmailNotification[] = await this.emailNotificationRepository.getPending();
    await Promise.all(
      pendingEmailNotifications.map(async (pendingEmailNotification) =>
        this.processEmailNotification(pendingEmailNotification),
      ),
    );
  }

  /**
   * Processes the pending notifications in the database by calling the corresponding functions and setting their status to "sent"
   *
   * @param {EmailNotification} emailNotification - Email notification to be processed
   * @returns {Promise<EmailNotification>} - Sent email notification
   */
  public async processEmailNotification(emailNotification: EmailNotification): Promise<EmailNotification> {
    switch (emailNotification.type) {
      case EmailNotificationType.StaffingRequestStatusPartiallyCovered:
        const {jobOrderId, tenantId} = emailNotification.payload;
        this.jobOrderNotificationService.sendStatusPartialEmailNotification(tenantId, jobOrderId);
        break;
      case EmailNotificationType.StaffingRequestDueDate24h:
      case EmailNotificationType.StaffingRequestDueDate48h:
        this.jobOrderNotificationService.sendDueDateApproachingEmailNotification(
          emailNotification.payload.tenantId,
          emailNotification.payload.jobOrderId,
        );
        break;
    }
    emailNotification.status = EmailNotificationStatus.Sent;
    return await this.emailNotificationRepository.save(emailNotification);
  }

  /**
   * Create a new EmailNotification record
   *
   * @param {PlainObject} data - The data which has to be used to create the new record
   * @returns {Promise<EmailNotification>} - A simple promise to ensure that the record has been created
   */
  public async create(data: PlainObject): Promise<EmailNotification> {
    const emailNotification = new EmailNotification(data);
    return this.emailNotificationRepository.save(emailNotification);
  }

  /**
   * Update a specific EmailTemplate
   *
   * @param {EmailNotification} emailNotification - The EmailTemplate record which has to be updated
   * @param {PlainObject} data - The data which has to be used to update the new record
   * @returns {Promise<EmailNotification>} - A simple promise to ensure that the record has been created
   */
  public async update(emailNotification: EmailNotification, data: PlainObject): Promise<EmailNotification> {
    emailNotification.type = data.type;
    emailNotification.email = data.email;
    emailNotification.payload = data.payload;
    emailNotification.sendDate = data.sendDate;
    emailNotification.status = data.status;

    return this.emailNotificationRepository.save(emailNotification);
  }

  /**
   * Find a specific JobOrder EmailNotification by its type and status
   *
   * @param {EmailNotificationType} type - The type of the notification
   * @param {string} jobOrderId - The ID of the JobOrder which is associated with the notification
   * @param {EmailNotificationStatus} status - The status of the notification
   * @returns {Promise<EmailNotification>} - The EmailNotification record
   */
  public async findOneByStatus(
    type: EmailNotificationType,
    jobOrderId: string,
    status: EmailNotificationStatus,
  ): Promise<EmailNotification> {
    const parameters: Array<PlainObject> = [
      {
        field: 'type',
        value: type,
      },
      {
        field: 'status',
        value: status,
      },
    ];

    const payloadParameters: Array<PlainObject> = [
      {
        field: 'jobOrderId',
        value: jobOrderId,
      },
    ];

    return this.emailNotificationRepository.findOne(parameters, payloadParameters);
  }

  /**
   * Find a specific Report EmailNotification by its type within some date range
   *
   * @param {EmailNotificationType} type - The type of the notification
   * @param {Date} from - from date
   * @param {Date} to - to date
   * @returns {Promise<EmailNotification>} - The EmailNotification record
   * @memberof EmailNotificationService
   */
  public async isReportSent(type: EmailNotificationType, from: Date, to: Date): Promise<EmailNotification> {
    return this.emailNotificationRepository.findOneInDateRange(type, from, to);
  }

  /**
   * Delete a specific EmailNotification
   *
   * @param {EmailNotification} emailNotification - The record which has to be deleted
   * @returns {Promise<EmailNotification>} - A simple promise to ensure that the record has been deleted
   */
  public async delete(emailNotification: EmailNotification): Promise<EmailNotification> {
    return this.emailNotificationRepository.delete(emailNotification);
  }
}
