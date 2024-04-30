import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface RoleChangeToAdminNotification extends BaseSingleNotification {
  firstName: string;
  link: string;
}
