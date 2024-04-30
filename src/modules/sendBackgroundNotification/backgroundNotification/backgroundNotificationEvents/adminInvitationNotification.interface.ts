import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface AdminInvitationNotification extends BaseSingleNotification {
  firstName: string;
  link: string;
}
