/**
 * List with all available Notification types
 */
enum NotificationTypeEnum {
  // There is a new comment on a specific Case
  NewCaseMessage = 'newCaseMessage',

  // The Status of a Case was changed to Closed
  CaseClosed = 'caseClosed',

  // The Status of a Case was changed to Opened
  CaseReopen = 'caseReopen',

  // The Role of an existing user was changed to Admin
  RoleChangeToAdmin = 'roleChangeToAdmin',

  // The Role of an existing user was changed to User
  RoleChangeToUser = 'roleChangeToUser',

  // The Role of an existing user was changed to User and the associated Admins should update his permissions
  SetupUserPermissions = 'setupUserPermissions',
}

/**
 * List with all of the supported entities which can be linked in the Notifications
 * NOTE: Maybe find an easier way just by specifying the entity name, or leave it as it is to have a complete list with all of the currently supported entities
 */
export enum NotificationEntityName {
  Case = 'Case', // Case.name
  User = 'User', // User.name
}

export {NotificationTypeEnum};
