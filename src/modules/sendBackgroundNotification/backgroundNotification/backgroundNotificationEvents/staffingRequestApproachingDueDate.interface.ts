import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface StaffingRequestApproachingDueDateNotification extends BaseSingleNotification {
  firstName: string;
  jobOrderName: string;
  jobOrderId: string;
  buttonUrl: string;
  loginUrl: string;
}
