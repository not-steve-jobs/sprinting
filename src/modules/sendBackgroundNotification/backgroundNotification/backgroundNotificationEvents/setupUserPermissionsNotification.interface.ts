import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface SetupUserPermissionsNotification extends BaseSingleNotification {
  adminFirstName: string;
  userFullName: string;
  link: string;
}
