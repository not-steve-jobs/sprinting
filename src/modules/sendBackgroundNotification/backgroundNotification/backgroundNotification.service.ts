import {forwardRef, Inject, Injectable} from '@nestjs/common';

import {FeatureConfigurationService} from 'src/modules/featureConfiguration/featureConfiguration.service';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {
  MailProvider,
  MmmHubApiDefinitionKeys,
} from 'src/modules/scheduledJobs/notificationSender/emailNotification.enum';
import {BaseMmmHubEmailMessage} from 'src/modules/scheduledJobs/notificationSender/mmmHub/mmmHub.type';

import {EmailQueuedService} from 'src/modules/sendBackgroundNotification/email/emailQueued.service';
import {EmailMessage} from 'src/modules/sendBackgroundNotification/email/emailMessage.interface';
import {NotificationEventType} from './backgroundNotificationEvents/notificationEventType.enum';
import {ContractToBeSignedNotification} from './backgroundNotificationEvents/contractToBeSignedNotification.interface';
import {AccountDisabledAdminsNotification} from './backgroundNotificationEvents/accountDisabledAdminsNotification.interface';
import {NewInvoiceNotification} from './backgroundNotificationEvents/newInvoiceNotification.interface';
import {BackgroundNotification} from './backgroundNotification.interface';
import {ContractToBeSignedTemplateBody} from './template/contractToBeSignedTemplateBody.interface';
import {UserInvitationTemplateBody, UserInvitedTemplateBody} from './template/userInvitationTemplateBody.interface';
import {AdminInvitationTemplateBody, AdminInvitedTemplateBody} from './template/adminInvitationTemplateBody.interface';
import {UserInvitationNotification} from './backgroundNotificationEvents/userInvitationNotification.interface';
import {AdminInvitationNotification} from './backgroundNotificationEvents/adminInvitationNotification.interface';
import {
  AccountDisabledAdminsTemplateBody,
  UserDisabledTemplateBody,
} from './template/accountDisabledAdminsTemplateBody.interface';
import {RoleChangeToAdminNotification} from './backgroundNotificationEvents/roleChangeToAdminNotification.interface';
import {
  RoleChangeToAdminSendgridTemplateBody,
  RoleChangeToAdminTemplateBody,
} from './template/roleChangeToAdminTemplateBody.interface';
import {RoleChangeToUserNotification} from './backgroundNotificationEvents/roleChangeToUserNotification.interface';
import {
  RoleChangeToUserSendgridTemplateBody,
  RoleChangeToUserTemplateBody,
} from './template/roleChangeToUserTemplateBody.interface';
import {NewInvoiceTemplateBody} from './template/newInvoiceTemplateBody.interface';
import {CaseClosedSendgridTemplateBody, CaseClosedTemplateBody} from './template/caseClosedTemplateBody.interface';
import {CaseClosedNotification} from './backgroundNotificationEvents/caseClosedNotification.interface';
import {StaffingRequestStatusChangedToInProgressNotification} from './backgroundNotificationEvents/staffingRequestStatusChangedToInProgressNotification.interface';
import {
  StaffingRequestStatusChangedToInProgressTemplateBody,
  StaffingRequestStatusInProgressTemplateBody,
} from './template/staffingRequestStatusChangedToInProgressTemplateBody.interface';
import {StaffingRequestStatusChangedToCoveredNotification} from './backgroundNotificationEvents/staffingRequestStatusChangedToCoveredNotification.interface';
import {
  StaffingRequestStatusChangedToCoveredTemplateBody,
  StaffingRequestStatusCoveredTemplateBody,
} from './template/staffingRequestStatusChangedToCoveredTemplateBody.interface';
import {StaffingRequestStatusChangedToSelectionNotification} from './backgroundNotificationEvents/staffingRequestStatusChangedToSelectionNotification.interface';
import {
  StaffingRequestStatusChangedToSelectionTemplateBody,
  StaffingRequestStatusSelectionTemplateBody,
} from './template/staffingRequestStatusChangedToSelectionTemplateBody.interface';
import {
  StaffingRequestStatusChangedToPartialTemplateBody,
  StaffingRequestStatusPartialTemplateBody,
} from './template/staffingRequestStatusPartialTemplateBody.interface';
import {StaffingRequestStatusPartialNotification} from './backgroundNotificationEvents/staffingRequestStatusPartialNotification.interface';
import {TenantService} from 'src/modules/tenant/tenant.service';
import {Tenant} from 'src/modules/tenant/tenant.entity';
import {CommonApplicationDetails, CommonTenantDetails} from './template/commonTemplateBody.interface';
import {CountryService} from 'src/modules/country/country.service';
import {Country} from 'src/modules/country/country.entity';
import {SetupUserPermissionsNotification} from './backgroundNotificationEvents/setupUserPermissionsNotification.interface';
import {
  SetupUserPermissionsSendgridTemplateBody,
  SetupUserPermissionsTemplateBody,
} from './template/setupUserPermissionsTemplateBody.interface';
import {
  StaffingRequestCandidateNotAvailableSendgridTemplateBody,
  StaffingRequestCandidateNotAvailableTemplateBody,
} from './template/staffingRequestCandidateNotAvailableTemplateBody.interface';
import {StaffingRequestCandidateNotAvailableNotification} from './backgroundNotificationEvents/staffingRequestCandidateNotAvailableNotification.interface';
import {StaffingRequestApproachingDueDateNotification} from './backgroundNotificationEvents/staffingRequestApproachingDueDate.interface';
import {
  StaffingRequestApproachingDueDateSendgridTemplateBody,
  StaffingRequestApproachingDueDateTemplateBody,
} from './template/staffingRequestApproachingDueDateTemplateBody.interface';
import {UserService} from 'src/modules/user/user.service';
import {User} from 'src/modules/user/user.entity';
import {getLanguageCode} from 'src/modules/userProfile/userProfile.utils';
import {BaseSingleNotification} from './backgroundNotificationEvents/baseSingleNotification.interface';
import {AppConfigService} from 'src/core/config/appConfig.service';

@Injectable()
export class BackgroundNotificationService implements BackgroundNotification {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly email: EmailQueuedService,
    private readonly featureConfigurationService: FeatureConfigurationService,
    private readonly tenantService: TenantService,
    private readonly countryService: CountryService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  /**
   * Add a new message to the queue to send an User Invitation email
   *
   * @param {UserInvitationNotification} userInvitationNotification - Info about the User which has to be passed to the email template for interpolation
   * @returns {Promise<void>} - Simple promise to ensure that the action has been dispatched successfully to the Mail Queue
   */
  public async emailUserInvitation(userInvitationNotification: UserInvitationNotification): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.UserInvited;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(userInvitationNotification.tenantId, eventType);

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(userInvitationNotification);

      message = {
        to: [userInvitationNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<UserInvitedTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: userInvitationNotification.email,
              to: userInvitationNotification.email,
              attributes: <UserInvitedTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: userInvitationNotification.userFirstName,
                AdminName: userInvitationNotification.adminFullName,
                ButtonURL: userInvitationNotification.link,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [userInvitationNotification.email],
        notificationType: NotificationEventType.UserInvitation,
        notificationContent: <UserInvitationTemplateBody>{
          firstName: userInvitationNotification.userFirstName,
          adminFullName: userInvitationNotification.adminFullName,
          url: userInvitationNotification.link,
        },
      };
    }

    return this.email.sendMail(message);
  }

  /**
   * Add a new message to the queue to send an Admin Invitation email
   *
   * @param {AdminInvitationNotification} adminInvitationNotification - Info about the User which has to be passed to the email template for interpolation
   * @returns {Promise<void>} - Simple promise to ensure that the action has been dispatched successfully to the Mail Queue
   */
  public async emailAdminInvitation(adminInvitationNotification: AdminInvitationNotification): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.AdminInvited;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(adminInvitationNotification.tenantId, eventType);

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(adminInvitationNotification);

      message = {
        to: [adminInvitationNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<AdminInvitedTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: adminInvitationNotification.email,
              to: adminInvitationNotification.email,
              attributes: <AdminInvitedTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: adminInvitationNotification.firstName,
                ButtonURL: adminInvitationNotification.link,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [adminInvitationNotification.email],
        notificationType: NotificationEventType.AdminInvitation,
        notificationContent: <AdminInvitationTemplateBody>{
          firstName: adminInvitationNotification.firstName,
          url: adminInvitationNotification.link,
        },
      };
    }

    return this.email.sendMail(message);
  }

  public async emailNewInvoice(newInvoice: NewInvoiceNotification): Promise<void> {
    const msg: EmailMessage = {
      to: [newInvoice.email],
      notificationType: NotificationEventType.NewInvoice,
      notificationContent: <NewInvoiceTemplateBody>{
        name: newInvoice.name,
        value: newInvoice.value,
      },
    };
    return this.email.sendMail(msg);
  }

  /**
   * Send email to all tenant admins once a user disables his/her account
   *
   * @param {AccountDisabledAdminsNotification} accountDisabledAdminsNotification - Info about the User which has to be passed to the email template for interpolation
   * @returns {Promise<void>} - Simple promise to ensure that the action has been dispatched successfully to the Mail Queue
   */
  public async emailAccountDisabledAdmins(
    accountDisabledAdminsNotification: AccountDisabledAdminsNotification,
  ): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.UserDisabled;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(
      accountDisabledAdminsNotification.tenantId,
      eventType,
    );

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(accountDisabledAdminsNotification);

      message = {
        to: [accountDisabledAdminsNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<UserDisabledTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: accountDisabledAdminsNotification.email,
              to: accountDisabledAdminsNotification.email,
              attributes: <UserDisabledTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: accountDisabledAdminsNotification.adminFirstName,
                FullName: accountDisabledAdminsNotification.userFullName,
                Location: accountDisabledAdminsNotification.userLocation,
                UserTitle: accountDisabledAdminsNotification.userTitle,
                Department: accountDisabledAdminsNotification.userDepartment,
                Function: accountDisabledAdminsNotification.userFunction,
                DisableReason: accountDisabledAdminsNotification.userDisableReason,
                ButtonURL: accountDisabledAdminsNotification.myColleaguesUrl,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [accountDisabledAdminsNotification.email],
        provider: MailProvider.Sendgrid,
        notificationType: NotificationEventType.UserAccountDisabledAdmins,
        notificationContent: <AccountDisabledAdminsTemplateBody>{
          adminFirstName: accountDisabledAdminsNotification.adminFirstName,
          userFullName: accountDisabledAdminsNotification.userFullName,
          userLocation: accountDisabledAdminsNotification.userLocation,
          userTitle: accountDisabledAdminsNotification.userTitle,
          userDepartment: accountDisabledAdminsNotification.userDepartment,
          userFunction: accountDisabledAdminsNotification.userFunction,
          userDisableReason: accountDisabledAdminsNotification.userDisableReason,
          myColleaguesUrl: accountDisabledAdminsNotification.myColleaguesUrl,
        },
      };
    }

    return this.email.sendMail(message);
  }

  /**
   * Add a new message to the queue to send a notification email to the owner of a Staffing Request which status has been changed to In Progress
   *
   * @param {StaffingRequestStatusChangedToInProgressNotification} statusChangeNotification - The payload with information for the notification which has to be send
   * @returns {Promise<void>} - A simple promise to ensure that the event has been dispatched to the Email Queue
   */
  public async emailStaffingRequestStatusChangedToInProgress(
    statusChangeNotification: StaffingRequestStatusChangedToInProgressNotification,
  ): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.StaffingRequestStatusInProgress;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(statusChangeNotification.tenantId, eventType);

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(statusChangeNotification);

      message = {
        to: [statusChangeNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<StaffingRequestStatusInProgressTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: statusChangeNotification.email,
              to: statusChangeNotification.email,
              attributes: <StaffingRequestStatusSelectionTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: statusChangeNotification.firstName,
                RoleName: statusChangeNotification.roleName,
                JobOrderName: statusChangeNotification.jobOrderName,
                ButtonURL: statusChangeNotification.link,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [statusChangeNotification.email],
        notificationType: NotificationEventType.StaffingRequestStatusChangedToInProgress,
        notificationContent: <StaffingRequestStatusChangedToInProgressTemplateBody>{
          firstName: statusChangeNotification.firstName,
          roleName: statusChangeNotification.roleName,
          jobOrderName: statusChangeNotification.jobOrderName,
          loginUrl: statusChangeNotification.link,
        },
      };
    }

    return this.email.sendMail(message);
  }

  /**
   * Add a new message to the queue to send a notification email to the owner of a Staffing Request which status is currently in Partially Covered
   *
   * @param {StaffingRequestStatusPartialNotification} statusPartialNotification - The payload with information for the notification which has to be send
   * @returns {Promise<void>} - A simple promise to ensure that the event has been dispatched to the Email Queue
   */
  public async emailStaffingRequestStatusPartial(
    statusPartialNotification: StaffingRequestStatusPartialNotification,
  ): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.StaffingRequestStatusPartial;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(statusPartialNotification.tenantId, eventType);

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(statusPartialNotification);

      message = {
        to: [statusPartialNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<StaffingRequestStatusPartialTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: statusPartialNotification.email,
              to: statusPartialNotification.email,
              attributes: <StaffingRequestStatusPartialTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: statusPartialNotification.firstName,
                RoleName: statusPartialNotification.roleName,
                NumberOfPlacements: statusPartialNotification.numberOfPlacements,
                JobOrderName: statusPartialNotification.jobOrderName,
                ButtonURL: statusPartialNotification.link,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [statusPartialNotification.email],
        notificationType: NotificationEventType.StaffingRequestStatusChangedToPartial,
        notificationContent: <StaffingRequestStatusChangedToPartialTemplateBody>{
          firstName: statusPartialNotification.firstName,
          roleName: statusPartialNotification.roleName,
          jobOrderName: statusPartialNotification.jobOrderName,
          numberOfPlacements: statusPartialNotification.numberOfPlacements,
          loginUrl: statusPartialNotification.link,
        },
      };
    }

    return this.email.sendMail(message);
  }

  /**
   * Add a new message to the queue to send a notification email to the owner of a Staffing Request which status has been changed to Selection
   *
   * @param {StaffingRequestStatusChangedToSelectionNotification} statusChangeNotification - The payload with information for the notification which has to be send
   * @returns {Promise<void>} - A simple promise to ensure that the event has been dispatched to the Email Queue
   */
  public async emailStaffingRequestStatusChangedToSelection(
    statusChangeNotification: StaffingRequestStatusChangedToSelectionNotification,
  ): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.StaffingRequestStatusSelection;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(statusChangeNotification.tenantId, eventType);

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(statusChangeNotification);

      message = {
        to: [statusChangeNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<StaffingRequestStatusSelectionTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: statusChangeNotification.email,
              to: statusChangeNotification.email,
              attributes: <StaffingRequestStatusSelectionTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: statusChangeNotification.firstName,
                RoleName: statusChangeNotification.roleName,
                JobOrderId: statusChangeNotification.jobOrderId,
                JobOrderName: statusChangeNotification.jobOrderName,
                ButtonURL: statusChangeNotification.link,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [statusChangeNotification.email],
        notificationType: NotificationEventType.StaffingRequestStatusChangedToSelection,
        notificationContent: <StaffingRequestStatusChangedToSelectionTemplateBody>{
          firstName: statusChangeNotification.firstName,
          roleName: statusChangeNotification.roleName,
          jobOrderName: statusChangeNotification.jobOrderName,
          loginUrl: statusChangeNotification.link,
        },
      };
    }

    return this.email.sendMail(message);
  }

  /**
   * Add a new message to the queue to send a notification email to the owner of a Staffing Request which status has been changed to Covered
   *
   * @param {StaffingRequestStatusChangedToCoveredNotification} statusChangeNotification - The payload with information for the notification which has to be send
   * @returns {Promise<void>} - A simple promise to ensure that the event has been dispatched to the Email Queue
   */
  public async emailStaffingRequestStatusChangedToCovered(
    statusChangeNotification: StaffingRequestStatusChangedToCoveredNotification,
  ): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.StaffingRequestStatusCovered;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(statusChangeNotification.tenantId, eventType);

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(statusChangeNotification);

      message = {
        to: [statusChangeNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<StaffingRequestStatusCoveredTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: statusChangeNotification.email,
              to: statusChangeNotification.email,
              attributes: <StaffingRequestStatusCoveredTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: statusChangeNotification.firstName,
                RoleName: statusChangeNotification.roleName,
                NumberOfOpenings: statusChangeNotification.numberOfOpenings,
                JobOrderName: statusChangeNotification.jobOrderName,
                ButtonURL: statusChangeNotification.link,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [statusChangeNotification.email],
        notificationType: NotificationEventType.StaffingRequestStatusChangedToCovered,
        notificationContent: <StaffingRequestStatusChangedToCoveredTemplateBody>{
          firstName: statusChangeNotification.firstName,
          roleName: statusChangeNotification.roleName,
          jobOrderName: statusChangeNotification.jobOrderName,
          numberOfOpenings: statusChangeNotification.numberOfOpenings,
          loginUrl: statusChangeNotification.link,
        },
      };
    }

    return this.email.sendMail(message);
  }

  /**
   * Add a new message to the queue to send a notification email to the owner of a Staffing Request to inform a candidate has rejected the offer
   *
   * @param {StaffingRequestCandidateNotAvailableNotification} candidateNotification - The payload with information for the notification which has to be send
   * @returns {Promise<void>} - A simple promise to ensure that the event has been dispatched to the Email Queue
   */
  public async emailStaffingRequestCandidateNotAvailable(
    candidateNotification: StaffingRequestCandidateNotAvailableNotification,
  ): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.StaffingRequestCandidateNotAvailable;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(candidateNotification.tenantId, eventType);

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(candidateNotification);

      message = {
        to: [candidateNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<StaffingRequestCandidateNotAvailableTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: candidateNotification.email,
              to: candidateNotification.email,
              attributes: <StaffingRequestCandidateNotAvailableTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: candidateNotification.firstName,
                RoleName: candidateNotification.roleName,
                JobOrderAssociateId: candidateNotification.jobOrderAssociateId,
                JobOrderName: candidateNotification.jobOrderName,
                ButtonURL: candidateNotification.buttonUrl,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [candidateNotification.email],
        notificationType: NotificationEventType.StaffingRequestCandidateChangedNotAvailable,
        notificationContent: <StaffingRequestCandidateNotAvailableSendgridTemplateBody>{
          firstName: candidateNotification.firstName,
          roleName: candidateNotification.roleName,
          jobOrderName: candidateNotification.jobOrderName,
          jobOrderAssociateId: candidateNotification.jobOrderAssociateId,
          buttonUrl: candidateNotification.buttonUrl,
          loginUrl: candidateNotification.loginUrl,
        },
      };
    }

    return this.email.sendMail(message);
  }

  /**
   * Add a new message to the queue to send a notification email to the owner of a Staffing Request to inform its employment start date is approaching
   *
   * @param {StaffingRequestApproachingDueDateNotification} candidateNotification - The payload with information for the notification which has to be send
   * @returns {Promise<void>} - A simple promise to ensure that the event has been dispatched to the Email Queue
   */
  public async emailStaffingRequestApproachingDueDate(
    candidateNotification: StaffingRequestApproachingDueDateNotification,
  ): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.StaffingRequestApproachingDueDate;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(candidateNotification.tenantId, eventType);

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(candidateNotification);

      message = {
        to: [candidateNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<StaffingRequestApproachingDueDateTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: candidateNotification.email,
              to: candidateNotification.email,
              attributes: <StaffingRequestApproachingDueDateTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: candidateNotification.firstName,
                JobOrderId: candidateNotification.jobOrderId,
                JobOrderName: candidateNotification.jobOrderName,
                ButtonURL: candidateNotification.buttonUrl,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [candidateNotification.email],
        notificationType: NotificationEventType.StaffingRequestCandidateChangedNotAvailable,
        notificationContent: <StaffingRequestApproachingDueDateSendgridTemplateBody>{
          firstName: candidateNotification.firstName,
          jobOrderName: candidateNotification.jobOrderName,
          jobOrderId: candidateNotification.jobOrderId,
          buttonUrl: candidateNotification.buttonUrl,
          loginUrl: candidateNotification.loginUrl,
        },
      };
    }

    return this.email.sendMail(message);
  }

  public async emailContractToBeSigned(contractToBeSignedDetails: ContractToBeSignedNotification): Promise<void> {
    const msg: EmailMessage = {
      to: contractToBeSignedDetails.emailList,
      notificationType: NotificationEventType.NewContractsToSign,
      notificationContent: <ContractToBeSignedTemplateBody>{
        contractNumber: contractToBeSignedDetails.contractNumber,
        createdAt: contractToBeSignedDetails.createdAt,
        dateStart: contractToBeSignedDetails.dateStart,
        dateEnd: contractToBeSignedDetails.dateEnd,
      },
    };
    return this.email.sendMail(msg);
  }

  /**
   * Send notification email to the User that his Case was marked as closed
   *
   * @param {CaseClosedNotification} caseClosedNotification - Info about the User and the Case which have to be passed to the email template for interpolation
   * @returns {Promise<void>} - Simple promise to ensure that the action has been dispatched successfully to the Mail Queue
   */
  public async emailCaseClosed(caseClosedNotification: CaseClosedNotification): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.CaseClosed;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(caseClosedNotification.tenantId, eventType);

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(caseClosedNotification);

      message = {
        to: [caseClosedNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<CaseClosedTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: caseClosedNotification.email,
              to: caseClosedNotification.email,
              attributes: <CaseClosedTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: caseClosedNotification.firstName,
                CaseName: caseClosedNotification.caseName,
                ButtonURL: caseClosedNotification.url,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [caseClosedNotification.email],
        notificationType: NotificationEventType.CaseClosedSendgrid,
        notificationContent: <CaseClosedSendgridTemplateBody>{
          firstName: caseClosedNotification.firstName,
          caseName: caseClosedNotification.caseName,
          url: caseClosedNotification.url,
        },
      };
    }

    return this.email.sendMail(message);
  }

  /**
   * Add a new message to the queue to send a Role Change to Admin notification email
   *
   * @param {RoleChangeToAdminNotification} roleChangeNotification - The payload with information for the notification which has to be send
   * @returns {Promise<void>} - A simple promise to ensure that the event has been dispatched to the Email Queue
   */
  public async emailRoleChangeToAdmin(roleChangeNotification: RoleChangeToAdminNotification): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.RoleChangeToAdmin;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(roleChangeNotification.tenantId, eventType);

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(roleChangeNotification);

      message = {
        to: [roleChangeNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<RoleChangeToAdminTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: roleChangeNotification.email,
              to: roleChangeNotification.email,
              attributes: <RoleChangeToAdminTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: roleChangeNotification.firstName,
                ButtonURL: roleChangeNotification.link,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [roleChangeNotification.email],
        notificationType: NotificationEventType.RoleChangeToAdminSendgrid,
        notificationContent: <RoleChangeToAdminSendgridTemplateBody>{
          firstName: roleChangeNotification.firstName,
          loginUrl: roleChangeNotification.link,
        },
      };
    }

    return this.email.sendMail(message);
  }

  /**
   * Add a new message to the queue to send a Role Change to User notification email
   *
   * @param {RoleChangeToUserNotification} roleChangeNotification - The payload with information for the notification which has to be send
   * @returns {Promise<void>} - A simple promise to ensure that the event has been dispatched to the Email Queue
   */
  public async emailRoleChangeToUser(roleChangeNotification: RoleChangeToUserNotification): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.RoleChangeToUser;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(roleChangeNotification.tenantId, eventType);

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(roleChangeNotification);

      message = {
        to: [roleChangeNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<RoleChangeToUserTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: roleChangeNotification.email,
              to: roleChangeNotification.email,
              attributes: <RoleChangeToUserTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: roleChangeNotification.firstName,
                ButtonURL: roleChangeNotification.link,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [roleChangeNotification.email],
        notificationType: NotificationEventType.RoleChangeToUserSendgrid,
        notificationContent: <RoleChangeToUserSendgridTemplateBody>{
          firstName: roleChangeNotification.firstName,
          loginUrl: roleChangeNotification.link,
        },
      };
    }

    return this.email.sendMail(message);
  }

  /**
   * Add a new message to the queue to send a Setup User Permissions notification email to a Tenant Admin
   *
   * @param {SetupUserPermissionsNotification} setupUserPermissionsNotification - The payload with information for the notification which has to be send
   * @returns {Promise<void>} - A simple promise to ensure that the event has been dispatched to the Email Queue
   */
  public async emailSetupUserPermissions(
    setupUserPermissionsNotification: SetupUserPermissionsNotification,
  ): Promise<void> {
    let message: EmailMessage;
    const eventType = NotificationEventType.SetupUserPermissions;

    // TODO: Once we disable the Sendgrid provider this fallback check can be removed
    const mailProvider: string = await this.getTemplateMailProvider(
      setupUserPermissionsNotification.tenantId,
      eventType,
    );

    if (mailProvider === MailProvider.MMMHub) {
      const tenantDetails: CommonTenantDetails = await this.getTenantDetails(setupUserPermissionsNotification);

      message = {
        to: [setupUserPermissionsNotification.email],
        provider: MailProvider.MMMHub,
        notificationType: eventType,
        notificationContent: <BaseMmmHubEmailMessage<SetupUserPermissionsTemplateBody>>{
          definitionKey: MmmHubApiDefinitionKeys.GlobalClientAccess,
          recipients: [
            {
              contactKey: setupUserPermissionsNotification.email,
              to: setupUserPermissionsNotification.email,
              attributes: <SetupUserPermissionsTemplateBody>{
                ...tenantDetails,
                EventType: eventType,
                Service_or_Campaign: eventType,
                FirstName: setupUserPermissionsNotification.adminFirstName,
                UserName: setupUserPermissionsNotification.userFullName,
                ButtonURL: setupUserPermissionsNotification.link,
              },
            },
          ],
        },
      };
    } else if (mailProvider === MailProvider.Sendgrid) {
      message = {
        to: [setupUserPermissionsNotification.email],
        notificationType: NotificationEventType.SetupUserPermissionsSendgrid,
        notificationContent: <SetupUserPermissionsSendgridTemplateBody>{
          firstName: setupUserPermissionsNotification.adminFirstName,
          userName: setupUserPermissionsNotification.userFullName,
          myColleaguesUrl: setupUserPermissionsNotification.link,
        },
      };
    }

    return this.email.sendMail(message);
  }

  /**
   * Get the provider for a specific email template from the FeatureConfigurations of the Tenant
   *
   * @param {number} tenantId - The ID of the Tenant
   * @param {string} template - The EmailTemplate for which provider we want to obtain information from the FeatureConfiguration
   * @returns {Promise<string>} - The MailProvider for he requested template
   */
  private async getTemplateMailProvider(tenantId: number, template: string): Promise<string> {
    const featureConfig = await this.featureConfigurationService.getFeatureConfigurationByFeatureName(
      tenantId,
      FeatureConfigurationFeature.MailProvider,
    );
    if (!featureConfig) {
      // Note: Temporary default fallback, will be removed once we migrate all templates and disable Sendgrid
      return MailProvider.Sendgrid;
    }

    // Check for an override of the feature configuration for a specific template
    if (featureConfig.config.templateProviders[template]) {
      return featureConfig.config.templateProviders[template];
    }

    return featureConfig.config.provider;
  }

  /**
   * Prepare a simple object with common details for the provided Tenant
   *
   * @param {number} tenantId - The ID of the Tenant for which we want to prepare details
   * @param {email} email - The email of the user required to obtain the language which should be used in the email templates
   * @returns {Promise<CommonTenantDetails>}
   */
  private async getTenantDetails({tenantId, email}: BaseSingleNotification): Promise<CommonTenantDetails> {
    const tenant: Tenant = await this.tenantService.findOne(tenantId);
    const country: Country = await this.countryService.findOne(tenant.countryId);
    const appDetails: CommonApplicationDetails = await this.getApplicationDetails();
    const emailLanguage: string = await this.getUserLanguage(email);

    return {
      ...appDetails,
      TenantId: tenant.id.toString(),
      Country: country.code,
      Brand: tenant.brand,
      Language: emailLanguage,
    };
  }

  private async getApplicationDetails(): Promise<CommonApplicationDetails> {
    return {
      ProductId: process.env.MMMHUB_NOTIFICATION_PRODUCTID ?? 'CLP',
      Type: process.env.MMMHUB_NOTIFICATION_TYPE ?? 'Transactional',
      Channel: process.env.MMMHUB_NOTIFICATION_CHANNEL ?? 'Email',
      Media: process.env.MMMHUB_NOTIFICATION_MEDIA ?? 'Email',
    };
  }

  /**
   * Get the selected user language by his email
   *
   * @param {string} email
   * @returns {Promise<string>}
   */
  private async getUserLanguage(email: string): Promise<string> {
    const user: User = await this.userService.findOneByEmail(email, ['userProfile']);
    const userLanguage = user?.userProfile?.language ?? this.appConfig.defaultLanguageLocale;

    return getLanguageCode(userLanguage).toUpperCase();
  }
}
