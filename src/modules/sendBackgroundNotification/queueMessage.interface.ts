import {MessageType} from './messageType.enum';
import {ContentType} from './contentType.enum';
import {BackgroundNotificationType} from './backgroundNotification/backgroundNotificationType.enum';
import {NotificationEventType} from './backgroundNotification/backgroundNotificationEvents/notificationEventType.enum';
import {
  UserInvitationTemplateBody,
  UserInvitedTemplateBody,
} from './backgroundNotification/template/userInvitationTemplateBody.interface';
import {
  AdminInvitationTemplateBody,
  AdminInvitedTemplateBody,
} from './backgroundNotification/template/adminInvitationTemplateBody.interface';
import {
  AccountDisabledAdminsTemplateBody,
  UserDisabledTemplateBody,
} from './backgroundNotification/template/accountDisabledAdminsTemplateBody.interface';
import {
  RoleChangeToAdminSendgridTemplateBody,
  RoleChangeToAdminTemplateBody,
} from './backgroundNotification/template/roleChangeToAdminTemplateBody.interface';
import {
  RoleChangeToUserSendgridTemplateBody,
  RoleChangeToUserTemplateBody,
} from './backgroundNotification/template/roleChangeToUserTemplateBody.interface';
import {
  SetupUserPermissionsSendgridTemplateBody,
  SetupUserPermissionsTemplateBody,
} from './backgroundNotification/template/setupUserPermissionsTemplateBody.interface';
import {NewInvoiceTemplateBody} from './backgroundNotification/template/newInvoiceTemplateBody.interface';
import {
  CaseClosedSendgridTemplateBody,
  CaseClosedTemplateBody,
} from './backgroundNotification/template/caseClosedTemplateBody.interface';
import {ContractToBeSignedTemplateBody} from './backgroundNotification/template/contractToBeSignedTemplateBody.interface';
import {MailProvider} from '../scheduledJobs/notificationSender/emailNotification.enum';
import {BaseMmmHubEmailMessage} from '../scheduledJobs/notificationSender/mmmHub/mmmHub.type';
import {StaffingRequestCandidateNotAvailableTemplateBody} from './backgroundNotification/template/staffingRequestCandidateNotAvailableTemplateBody.interface';
import {StaffingRequestApproachingDueDateTemplateBody} from './backgroundNotification/template/staffingRequestApproachingDueDateTemplateBody.interface';

export interface QueueMessage {
  messageType: MessageType;
  provider?: MailProvider; // TODO: Temporary added, remove once we no longer support Sendgrid
  notificationType: BackgroundNotificationType;
  contentType: ContentType;
  eventTemplateType?: NotificationEventType;
  to: string[];
  content:
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
    | BaseMmmHubEmailMessage<StaffingRequestCandidateNotAvailableTemplateBody>
    | BaseMmmHubEmailMessage<StaffingRequestApproachingDueDateTemplateBody>
    | RoleChangeToAdminSendgridTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | RoleChangeToUserSendgridTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | SetupUserPermissionsSendgridTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | NewInvoiceTemplateBody
    | ContractToBeSignedTemplateBody
    | CaseClosedSendgridTemplateBody // TODO: Migrated to MMM Hub, will be no longer used, to be removed once we disable Sendgrid
    | CaseClosedTemplateBody;
}
