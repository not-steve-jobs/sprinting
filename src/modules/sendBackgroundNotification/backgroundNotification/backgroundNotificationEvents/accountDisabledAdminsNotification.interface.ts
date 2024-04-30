import {BaseSingleNotification} from './baseSingleNotification.interface';

export interface AccountDisabledAdminsNotification extends BaseSingleNotification {
  adminFirstName: string;
  userFullName: string;
  userLocation: string;
  userTitle: string;
  userDepartment: string;
  userFunction: string;
  userDisableReason: string;
  myColleaguesUrl: string;
}
