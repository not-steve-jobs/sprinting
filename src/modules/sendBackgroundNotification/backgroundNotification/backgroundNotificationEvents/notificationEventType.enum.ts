export enum NotificationEventType {
  // Sendgrid Notification Types, to be removed once we turn it off
  NewInvoice = 'newInvoice',
  NewContractsToSign = 'newContractsToSign',
  NewMessages = 'newMessages',
  UserAccountDisabled = 'userAccountDisabled', // TODO: Deprecated, this email template is no longer used and have to be removed once the Sendgrid service is disabled
  UserAccountDisabledAdmins = 'userAccountDisabledAdmins', // TODO: Deprecated and migrated, remove once the Sendgrid service is disabled
  AdminInvitation = 'adminInvitation', // TODO: Deprecated and migrated, remove once the Sendgrid service is disabled
  UserInvitation = 'userInvitation', // TODO: Deprecated and migrated, remove once the Sendgrid service is disabled
  RoleChangeToAdminSendgrid = 'roleChangeToAdmin', // TODO: Deprecated and migrated, remove once the Sendgrid service is disabled
  RoleChangeToUserSendgrid = 'roleChangeToUser', // TODO: Deprecated and migrated, remove once the Sendgrid service is disabled
  SetupUserPermissionsSendgrid = 'setupUserPermissions', // TODO: Deprecated and migrated, remove once the Sendgrid service is disabled
  CaseClosedSendgrid = 'caseClosed', // TODO: Deprecated and migrated, remove once the Sendgrid service is disabled
  StaffingRequestStatusChangedToInProgress = 'staffingRequestStatusChangedToInProgress', // TODO: Deprecated, this email template is no longer used and have to be removed once the Sendgrid service is disabled
  StaffingRequestStatusChangedToPartial = 'staffingRequestStatusPartial', // TODO: Deprecated, this email template is no longer used and have to be removed once the Sendgrid service is disabled
  StaffingRequestStatusChangedToSelection = 'staffingRequestStatusChangedToSelection', // TODO: Deprecated, this email template is no longer used and have to be removed once the Sendgrid service is disabled
  StaffingRequestStatusChangedToCovered = 'staffingRequestStatusChangedToCovered', // TODO: Deprecated, this email template is no longer used and have to be removed once the Sendgrid service is disabled
  StaffingRequestCandidateChangedNotAvailable = 'staffingRequestCandidateNotAvailable', // TODO: Deprecated, this email template is no longer used and have to be removed once the Sendgrid service is disabled
  StaffingRequestApproachingDueDateSendgrid = 'staffingRequestApproachingDueDate', // TODO: Deprecated, this email template is no longer used and have to be removed once the Sendgrid service is disabled

  // MMM Hub Event Types, gradually migrating the old Sendgrid templates to this service
  AdminInvited = 'AdminInvited',
  UserInvited = 'UserInvited',
  UserDisabled = 'UserDisabled',
  RoleChangeToAdmin = 'RoleChangeToAdmin',
  RoleChangeToUser = 'RoleChangeToUser',
  SetupUserPermissions = 'SetupUserPermissions',
  StaffingRequestStatusInProgress = 'StaffingRequestStatusInProgress',
  StaffingRequestStatusSelection = 'StaffingRequestStatusSelection',
  StaffingRequestStatusPartial = 'StaffingRequestStatusPartial',
  StaffingRequestStatusCovered = 'StaffingRequestStatusCovered',
  StaffingRequestCandidateNotAvailable = 'StaffingRequestCandidateNotAvailable',
  StaffingRequestApproachingDueDate = 'StaffingRequestApproachingDueDate',
  CaseClosed = 'CaseClosed',
}
