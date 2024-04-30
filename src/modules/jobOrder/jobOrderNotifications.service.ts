import * as dateFns from 'date-fns';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {User} from 'src/modules/user/user.entity';
import {Status} from 'src/modules/status/status.entity';
import {EmailNotificationStatus, JobOrderStatus} from 'src/modules/status/status.enum';
import {EmailNotificationType} from 'src/modules/emailNotification/emailNotification.enum';
import {EmailNotificationService} from 'src/modules/emailNotification/emailNotification.service';
import {BackgroundNotificationService} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotification.service';
import {StaffingRequestStatusChangedToInProgressNotification} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/staffingRequestStatusChangedToInProgressNotification.interface';
import {StaffingRequestStatusPartialNotification} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/staffingRequestStatusPartialNotification.interface';
import {StaffingRequestStatusChangedToCoveredNotification} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/staffingRequestStatusChangedToCoveredNotification.interface';
import {StaffingRequestStatusChangedToSelectionNotification} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/staffingRequestStatusChangedToSelectionNotification.interface';
import {JobOrder} from './jobOrder.entity';
import {JobOrderService} from './jobOrder.service';
import {JobOrderDto} from './dto/jobOrder.dto';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {EmailNotification} from '../emailNotification/emailNotification.entity';
import {StaffingRequestCandidateNotAvailableNotification} from '../sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/staffingRequestCandidateNotAvailableNotification.interface';
import {StaffingRequestApproachingDueDateNotification} from '../sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/staffingRequestApproachingDueDate.interface';

@Injectable()
export class JobOrderNotificationsService {
  private HOUR_TO_SEND_OUT: number = 18;
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly notify: BackgroundNotificationService,
    @Inject(forwardRef(() => JobOrderService))
    private readonly jobOrderService: JobOrderService,
    @Inject(forwardRef(() => EmailNotificationService))
    private readonly emailNotificationService: EmailNotificationService,
    private readonly tenantUserRepository: TenantUserRepository,
  ) {}

  /**
   * Send an email notification to the owner of a JobOrder once its status has been changed
   *
   * @param {JobOrder} jobOrder - The JobOrder which status has been changed
   * @param {Status} status - The new Status of the JobOrder
   * @returns {Promise<void>} - Simple promise to ensure that the action has been dispatched successfully
   */
  public async sendStatusChangedEmailNotification(jobOrder: JobOrder, status: Status): Promise<void> {
    if (!jobOrder || !status || jobOrder.statusId === status.id) {
      return;
    }

    if (!jobOrder.tenantUser.user.emailNotifications) {
      return;
    }

    switch (status.name) {
      case JobOrderStatus.InProgress:
        return await this.sendStatusChangedToInProgressEmailNotification(jobOrder);
      case JobOrderStatus.CandidatesPreselection:
        return await this.sendStatusChangedToSelectionEmailNotification(jobOrder);
      case JobOrderStatus.Covered:
        return await this.sendStatusChangedToCoveredEmailNotification(jobOrder);
    }
  }

  /**
   * Schedule a new notification according to the new status of the JobOrder
   * If the JobOrder becomes in PartiallyCovered state we have to schedule a new notification (or override the last one)
   * If the JobOrder becomes in Covered state and there is a already scheduled notification which is still Pending we have to discard it
   *
   * @param {JobOrder} jobOrder - The JobOrder which status has been changed
   * @param {status} status - The new Status of the JobOrder
   * @returns {Promise<void>} - A simple promise to ensure that the action hae been dispatched successfully
   */
  public async schedulePartiallyCoveredEmailNotification(jobOrder: JobOrder, status: Status): Promise<void> {
    // Search for a Pending record which is due now and has to be send
    const emailNotification: EmailNotification = await this.emailNotificationService.findOneByStatus(
      EmailNotificationType.StaffingRequestStatusPartiallyCovered,
      jobOrder.id,
      EmailNotificationStatus.Pending,
    );

    const partialJobOrderStatuses: string[] = [JobOrderStatus.PartiallyCovered];
    const coveredJobOrderStatuses: string[] = [JobOrderStatus.Covered, JobOrderStatus.FullyCovered];

    if (partialJobOrderStatuses.includes(status.name)) {
      // Schedule a notification email to be send later today
      const emailNotificationData = {
        type: EmailNotificationType.StaffingRequestStatusPartiallyCovered,
        email: jobOrder.tenantUser.user.email,
        payload: {
          jobOrderId: jobOrder.id,
          tenantId: jobOrder.tenantUser.tenantId,
        },
        sendDate: dateFns.set(new Date(), {
          hours: this.HOUR_TO_SEND_OUT,
          minutes: 0,
        }),
        status: EmailNotificationStatus.Pending,
      };

      if (!emailNotification) {
        await this.emailNotificationService.create(emailNotificationData);
      } else {
        await this.emailNotificationService.update(emailNotification, emailNotificationData);
      }
    } else if (coveredJobOrderStatuses.includes(status.name)) {
      // If there is a Pending scheduled email for this order we have to discard it
      if (emailNotification) {
        await this.emailNotificationService.delete(emailNotification);
      }
    }
  }

  /**
   * Trigger a new notification email to the owner of the Staffing Request to notify him/her about
   * the most recent candidates updates
   *
   * @param {number} tenantId - The ID of the Tenant which is associated with the Staffing Request
   * @param {string} jobOrderId - The ID of the Staffing Request with info for the candidates
   * @returns {Promise<void>} - A simple promise to ensure that the action hae been dispatched successfully
   */
  public async sendStatusPartialEmailNotification(tenantId: number, jobOrderId: string): Promise<void> {
    const jobOrder: JobOrderDto = await this.jobOrderService.get(tenantId, jobOrderId, [
      'jobOrderAssociate',
      'jobOrderAssociate.status',
      'jobRole',
    ]);
    const numberOfPlacedAssociates: number = jobOrder.noOfPlacedAssociates;
    const tenantUser: TenantUser = await this.tenantUserRepository.findOne(tenantId, jobOrder.userId);
    const hostName: string = UtilsHelper.getHostName(this.appConfig);

    if (!tenantUser.user.emailNotifications) {
      return Promise.resolve();
    }

    const message: StaffingRequestStatusPartialNotification = {
      tenantId: tenantUser.tenantId,
      email: tenantUser.user?.email,
      firstName: tenantUser.user?.userProfile?.firstName,
      roleName: jobOrder.jobRole?.name,
      jobOrderName: jobOrder.name,
      numberOfPlacements: numberOfPlacedAssociates,
      link: hostName,
    };

    return await this.notify.emailStaffingRequestStatusPartial(message);
  }

  /**
   * Trigger a new notification email to the owner of the Staffing Request that the status
   * of his order has been changed to In Progress
   *
   * @param {JobOrder} jobOrder - The Staffing Request which status changed
   * @returns {Promise<void>} - A simple promise to ensure that the action hae been dispatched successfully
   */
  private async sendStatusChangedToInProgressEmailNotification(jobOrder: JobOrder): Promise<void> {
    const user: User = jobOrder.tenantUser.user;
    const hostName: string = UtilsHelper.getHostName(this.appConfig);

    const message: StaffingRequestStatusChangedToInProgressNotification = {
      tenantId: jobOrder.tenantUser.tenantId,
      email: user.email,
      firstName: user.userProfile?.firstName,
      roleName: jobOrder.jobRole?.name,
      jobOrderName: jobOrder.name,
      link: hostName,
    };

    return await this.notify.emailStaffingRequestStatusChangedToInProgress(message);
  }

  /**
   * Trigger a new notification email to the owner of the Staffing Request that the status
   * of his order has been changed to Selection
   *
   * @param {JobOrder} jobOrder - The Staffing Request which status changed
   * @returns {Promise<void>} - A simple promise to ensure that the action hae been dispatched successfully
   */
  private async sendStatusChangedToSelectionEmailNotification(jobOrder: JobOrder): Promise<void> {
    const user: User = jobOrder.tenantUser.user;
    const hostName: string = UtilsHelper.getHostName(this.appConfig);

    const message: StaffingRequestStatusChangedToSelectionNotification = {
      tenantId: jobOrder.tenantUser.tenantId,
      email: user.email,
      firstName: user.userProfile?.firstName,
      roleName: jobOrder.jobRole?.name,
      jobOrderId: UtilsHelper.formatReferenceNumber(jobOrder.id),
      jobOrderName: jobOrder.name,
      link: hostName,
    };

    return await this.notify.emailStaffingRequestStatusChangedToSelection(message);
  }

  /**
   * Trigger a new notification email to the owner of the Staffing Request that the status
   * of his order has been changed to Fully Covered
   *
   * @param {JobOrder} jobOrder - The Staffing Request which status changed
   * @returns {Promise<void>} - A simple promise to ensure that the action hae been dispatched successfully
   */
  private async sendStatusChangedToCoveredEmailNotification(jobOrder: JobOrder): Promise<void> {
    const user: User = jobOrder.tenantUser.user;
    const hostName: string = UtilsHelper.getHostName(this.appConfig);

    const message: StaffingRequestStatusChangedToCoveredNotification = {
      tenantId: jobOrder.tenantUser.tenantId,
      email: user.email,
      firstName: user.userProfile?.firstName,
      roleName: jobOrder.jobRole?.name,
      jobOrderName: jobOrder.name,
      numberOfOpenings: jobOrder.numberOfOpenings,
      link: hostName,
    };

    return await this.notify.emailStaffingRequestStatusChangedToCovered(message);
  }

  /**
   * Trigger a new notification email to the owner of the Staffing Request when it is rejected
   *
   * @param {JobOrder} jobOrder - The rejected Staffing Request
   * @param {string} jobOrderAssociateId - Id of user who rejected the Staffing Request
   * @returns {Promise<void>} - A simple promise to ensure that the action hae been dispatched successfully
   */
  public async sendAssociateNotAvailableEmailNotification(
    jobOrder: JobOrder,
    jobOrderAssociateId: string,
  ): Promise<void> {
    const user: User = jobOrder.tenantUser.user;
    const hostName: string = UtilsHelper.getHostName(this.appConfig);

    const message: StaffingRequestCandidateNotAvailableNotification = {
      tenantId: jobOrder.tenantUser.tenantId,
      email: user.email,
      firstName: user.userProfile?.firstName,
      roleName: jobOrder.jobRole?.name,
      jobOrderName: jobOrder.name,
      jobOrderAssociateId,
      buttonUrl: `${hostName}/client/order-details/${jobOrder.id}/details`,
      loginUrl: hostName,
    };

    return await this.notify.emailStaffingRequestCandidateNotAvailable(message);
  }

  /**
   * Creates records for notification emails when start date of the Staffing Request is close.
   *
   * @param {string} tenantId - Id of tenant, owner of the Staffing Request
   * @param {string} jobOrderId - Id of user, owner of the Staffing Request
   * @returns {Promise<EmailNotification[]>} - Promise, returning the two records
   */
  public async scheduleDueDateEmailNotifications(tenantId: number, jobOrderId: string): Promise<EmailNotification[]> {
    const jobOrder: JobOrder = await this.jobOrderService.findOneByTenantIdAndJobOrderId(
      tenantId,
      jobOrderId,
      false,
      true,
      false,
    );
    let sendDate: Date = dateFns.set(jobOrder.dateStart, {hours: this.HOUR_TO_SEND_OUT, minutes: 0});
    const now: Date = new Date();
    const email: string = jobOrder.tenantUser.user.email;
    const notifications: Promise<EmailNotification>[] = [];

    sendDate = dateFns.subHours(sendDate, 24);
    if (dateFns.isAfter(sendDate, now)) {
      notifications.push(
        this.emailNotificationService.create({
          email,
          type: EmailNotificationType.StaffingRequestDueDate24h,
          payload: {jobOrderId, tenantId},
          sendDate: dateFns.toDate(sendDate),
          status: EmailNotificationStatus.Pending,
        }),
      );
    }

    sendDate = dateFns.subHours(sendDate, 24);
    if (dateFns.isAfter(sendDate, now)) {
      //second 24h subtract, e.g. 48h
      notifications.push(
        this.emailNotificationService.create({
          email,
          type: EmailNotificationType.StaffingRequestDueDate48h,
          payload: {jobOrderId, tenantId},
          sendDate: dateFns.toDate(sendDate),
          status: EmailNotificationStatus.Pending,
        }),
      );
    }

    return await Promise.all(notifications);
  }

  /**
   * Trigger a new notification email to the owner of the Staffing Request when its employment start date is approaching
   *
   * @param {string} tenantId - Id of tenant, owner of the Staffing Request
   * @param {string} jobOrderId - Id of user, owner of the Staffing Request
   * @returns {Promise<void>} - A simple promise to ensure that the action hae been dispatched successfully
   */
  public async sendDueDateApproachingEmailNotification(tenantId: number, jobOrderId: string): Promise<void> {
    const jobOrder: JobOrder = await this.jobOrderService.findOneByTenantIdAndJobOrderId(
      tenantId,
      jobOrderId,
      true,
      true,
      false,
      ['jobOrderAssociate'],
    );
    const user: User = jobOrder.tenantUser.user;
    const isOrderInCorrectStatus: boolean =
      jobOrder.status.name === JobOrderStatus.InProgress ||
      jobOrder.status.name === JobOrderStatus.CandidatesPreselection ||
      jobOrder.status.name === JobOrderStatus.Submitted;
    if (user.emailNotifications && isOrderInCorrectStatus && jobOrder.jobOrderAssociate.length > 0) {
      const hostName: string = UtilsHelper.getHostName(this.appConfig);
      const message: StaffingRequestApproachingDueDateNotification = {
        tenantId: jobOrder.tenantUser.tenantId,
        email: user.email,
        firstName: user.userProfile?.firstName,
        jobOrderName: jobOrder.name,
        jobOrderId: jobOrder.id,
        buttonUrl: `${hostName}/client/order-details/${jobOrder.id}/details`,
        loginUrl: hostName,
      };
      return await this.notify.emailStaffingRequestApproachingDueDate(message);
    } else {
      return Promise.resolve();
    }
  }
}
