// The origin of the disable action, i.e. who dispatched the action
export enum DisableUserOrigin {
  INFO = 'InFO', // The User has been disabled from InFO
  CLP_ADMIN = 'clp-admin', // The User has been disabled by a CLP Admin
  CLP_USER = 'clp-user', // The User disabled himself from CLP
}
