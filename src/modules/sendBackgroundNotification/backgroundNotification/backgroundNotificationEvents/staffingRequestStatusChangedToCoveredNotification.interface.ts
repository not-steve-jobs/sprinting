import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface StaffingRequestStatusChangedToCoveredNotification extends BaseSingleNotification {
  firstName: string;
  roleName: string;
  jobOrderName: string;
  numberOfOpenings: number;
  link: string;
}
