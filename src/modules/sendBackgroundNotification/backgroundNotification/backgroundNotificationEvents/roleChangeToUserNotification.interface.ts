import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface RoleChangeToUserNotification extends BaseSingleNotification {
  firstName: string;
  link: string;
}
