import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface StaffingRequestStatusChangedToInProgressNotification extends BaseSingleNotification {
  firstName: string;
  roleName: string;
  jobOrderName: string;
  link: string;
}
