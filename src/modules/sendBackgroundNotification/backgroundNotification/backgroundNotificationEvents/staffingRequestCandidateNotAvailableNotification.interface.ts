import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface StaffingRequestCandidateNotAvailableNotification extends BaseSingleNotification {
  roleName: string;
  firstName: string;
  jobOrderAssociateId: string;
  jobOrderName: string;
  buttonUrl: string;
  loginUrl: string;
}
