import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface UserInvitationNotification extends BaseSingleNotification {
  userFirstName: string;
  adminFullName: string;
  link: string;
}
