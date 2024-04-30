import {NotificationEventType} from '../backgroundNotification/backgroundNotificationEvents/notificationEventType.enum';
import {ContractToBeSignedTemplateBody} from '../backgroundNotification/template/contractToBeSignedTemplateBody.interface';
import {
  AccountDisabledAdminsTemplateBody,
  UserDisabledTemplateBody,
} from '../backgroundNotification/template/accountDisabledAdminsTemplateBody.interface';
import {
  RoleChangeToAdminSendgridTemplateBody,
  RoleChangeToAdminTemplateBody,
} from '../backgroundNotification/template/roleChangeToAdminTemplateBody.interface';
import {
  RoleChangeToUserSendgridTemplateBody,
  RoleChangeToUserTemplateBody,
} from '../backgroundNotification/template/roleChangeToUserTemplateBody.interface';
import {NewInvoiceTemplateBody} from '../backgroundNotification/template/newInvoiceTemplateBody.interface';
import {
  CaseClosedSendgridTemplateBody,
  CaseClosedTemplateBody,
} from '../backgroundNotification/template/caseClosedTemplateBody.interface';
import {
  UserInvitationTemplateBody,
  UserInvitedTemplateBody,
} from '../backgroundNotification/template/userInvitationTemplateBody.interface';
import {
  AdminInvitationTemplateBody,
  AdminInvitedTemplateBody,
} from '../backgroundNotification/template/adminInvitationTemplateBody.interface';
import {
  StaffingRequestStatusChangedToInProgressTemplateBody,
  StaffingRequestStatusInProgressTemplateBody,
} from '../backgroundNotification/template/staffingRequestStatusChangedToInProgressTemplateBody.interface';
import {
  StaffingRequestStatusChangedToCoveredTemplateBody,
  StaffingRequestStatusCoveredTemplateBody,
} from '../backgroundNotification/template/staffingRequestStatusChangedToCoveredTemplateBody.interface';
import {
  StaffingRequestStatusChangedToSelectionTemplateBody,
  StaffingRequestStatusSelectionTemplateBody,
} from '../backgroundNotification/template/staffingRequestStatusChangedToSelectionTemplateBody.interface';
import {
  StaffingRequestStatusChangedToPartialTemplateBody,
  StaffingRequestStatusPartialTemplateBody,
} from '../backgroundNotification/template/staffingRequestStatusPartialTemplateBody.interface';
import {MailProvider} from 'src/modules/scheduledJobs/notificationSender/emailNotification.enum';
import {BaseMmmHubEmailMessage} from 'src/modules/scheduledJobs/notificationSender/mmmHub/mmmHub.type';
import {
  SetupUserPermissionsSendgridTemplateBody,
  SetupUserPermissionsTemplateBody,
} from '../backgroundNotification/template/setupUserPermissionsTemplateBody.interface';
import {
  StaffingRequestCandidateNotAvailableSendgridTemplateBody,
  StaffingRequestCandidateNotAvailableTemplateBody,
} from '../backgroundNotification/template/staffingRequestCandidateNotAvailableTemplateBody.interface';
import {
  StaffingRequestApproachingDueDateSendgridTemplateBody,
  StaffingRequestApproachingDueDateTemplateBody,
} from '../backgroundNotification/template/staffingRequestApproachingDueDateTemplateBody.interface';

export interface EmailMessage {
  to: string[];
  provider?: MailProvider; // TODO: Temporary added, remove once we no longer support Sendgrid
  notificationType: NotificationEventType;
  notificationContent:
    | string
    | UserInvitationTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | AdminInvitationTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | AccountDisabledAdminsTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | BaseMmmHubEmailMessage<AdminInvitedTemplateBody>
    | BaseMmmHubEmailMessage<UserInvitedTemplateBody>
    | BaseMmmHubEmailMessage<UserDisabledTemplateBody>
    | BaseMmmHubEmailMessage<RoleChangeToAdminTemplateBody>
    | BaseMmmHubEmailMessage<RoleChangeToUserTemplateBody>
    | BaseMmmHubEmailMessage<SetupUserPermissionsTemplateBody>
    | RoleChangeToAdminSendgridTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | RoleChangeToUserSendgridTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | SetupUserPermissionsSendgridTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | NewInvoiceTemplateBody
    | StaffingRequestStatusChangedToInProgressTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | StaffingRequestStatusChangedToPartialTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | StaffingRequestStatusChangedToSelectionTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | StaffingRequestStatusChangedToCoveredTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | StaffingRequestCandidateNotAvailableSendgridTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | StaffingRequestApproachingDueDateSendgridTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | BaseMmmHubEmailMessage<StaffingRequestStatusInProgressTemplateBody>
    | BaseMmmHubEmailMessage<StaffingRequestStatusSelectionTemplateBody>
    | BaseMmmHubEmailMessage<StaffingRequestStatusPartialTemplateBody>
    | BaseMmmHubEmailMessage<StaffingRequestStatusCoveredTemplateBody>
    | BaseMmmHubEmailMessage<StaffingRequestCandidateNotAvailableTemplateBody>
    | BaseMmmHubEmailMessage<StaffingRequestApproachingDueDateTemplateBody>
    | ContractToBeSignedTemplateBody
    | CaseClosedSendgridTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | BaseMmmHubEmailMessage<CaseClosedTemplateBody>;
}
