import {UserInvitationNotification} from './backgroundNotificationEvents/userInvitationNotification.interface';
import {AdminInvitationNotification} from './backgroundNotificationEvents/adminInvitationNotification.interface';
import {NewInvoiceNotification} from './backgroundNotificationEvents/newInvoiceNotification.interface';
import {AccountDisabledAdminsNotification} from './backgroundNotificationEvents/accountDisabledAdminsNotification.interface';
import {StaffingRequestStatusPartialNotification} from './backgroundNotificationEvents/staffingRequestStatusPartialNotification.interface';
import {StaffingRequestStatusChangedToCoveredNotification} from './backgroundNotificationEvents/staffingRequestStatusChangedToCoveredNotification.interface';
import {StaffingRequestStatusChangedToSelectionNotification} from './backgroundNotificationEvents/staffingRequestStatusChangedToSelectionNotification.interface';
import {ContractToBeSignedNotification} from './backgroundNotificationEvents/contractToBeSignedNotification.interface';
import {CaseClosedNotification} from './backgroundNotificationEvents/caseClosedNotification.interface';
import {RoleChangeToAdminNotification} from './backgroundNotificationEvents/roleChangeToAdminNotification.interface';
import {RoleChangeToUserNotification} from './backgroundNotificationEvents/roleChangeToUserNotification.interface';
import {SetupUserPermissionsNotification} from './backgroundNotificationEvents/setupUserPermissionsNotification.interface';
import {StaffingRequestStatusChangedToInProgressNotification} from './backgroundNotificationEvents/staffingRequestStatusChangedToInProgressNotification.interface';
import {StaffingRequestCandidateNotAvailableNotification} from './backgroundNotificationEvents/staffingRequestCandidateNotAvailableNotification.interface';
import {StaffingRequestApproachingDueDateNotification} from './backgroundNotificationEvents/staffingRequestApproachingDueDate.interface';

export interface BackgroundNotification {
  emailUserInvitation(invitation: UserInvitationNotification): Promise<void>;
  emailAdminInvitation(invitation: AdminInvitationNotification): Promise<void>;
  emailNewInvoice(newInvoice: NewInvoiceNotification): Promise<void>;
  emailAccountDisabledAdmins(accountDisabledAdmins: AccountDisabledAdminsNotification): Promise<void>;
  emailStaffingRequestStatusChangedToInProgress(
    statusChangeNotification: StaffingRequestStatusChangedToInProgressNotification,
  ): Promise<void>;
  emailStaffingRequestStatusChangedToSelection(
    statusChangeNotification: StaffingRequestStatusChangedToSelectionNotification,
  ): Promise<void>;
  emailStaffingRequestStatusPartial(statusChangeNotification: StaffingRequestStatusPartialNotification): Promise<void>;
  emailStaffingRequestStatusChangedToCovered(
    statusChangeNotification: StaffingRequestStatusChangedToCoveredNotification,
  ): Promise<void>;
  emailStaffingRequestCandidateNotAvailable(
    statusChangeNotification: StaffingRequestCandidateNotAvailableNotification,
  ): Promise<void>;
  emailStaffingRequestApproachingDueDate(
    statusChangeNotification: StaffingRequestApproachingDueDateNotification,
  ): Promise<void>;
  emailContractToBeSigned(contractToBeSignedDetails: ContractToBeSignedNotification): Promise<void>;
  emailCaseClosed(caseClosedNotification: CaseClosedNotification): Promise<void>;
  emailRoleChangeToAdmin(roleChangeNotification: RoleChangeToAdminNotification): Promise<void>;
  emailRoleChangeToUser(roleChangeNotification: RoleChangeToUserNotification): Promise<void>;
  emailSetupUserPermissions(setupUserPermissionsNotification: SetupUserPermissionsNotification): Promise<void>;
}
