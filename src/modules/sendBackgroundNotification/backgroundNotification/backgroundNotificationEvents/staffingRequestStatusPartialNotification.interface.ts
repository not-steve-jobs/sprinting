import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface StaffingRequestStatusPartialNotification extends BaseSingleNotification {
  firstName: string;
  roleName: string;
  jobOrderName: string;
  numberOfPlacements: number;
  link: string;
}
