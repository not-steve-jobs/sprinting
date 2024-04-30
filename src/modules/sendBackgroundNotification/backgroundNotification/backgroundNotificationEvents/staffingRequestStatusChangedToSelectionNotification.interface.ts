import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface StaffingRequestStatusChangedToSelectionNotification extends BaseSingleNotification {
  firstName: string;
  roleName: string;
  jobOrderId: string;
  jobOrderName: string;
  link: string;
}
