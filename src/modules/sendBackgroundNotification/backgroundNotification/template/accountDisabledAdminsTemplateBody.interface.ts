import {CommonTemplateBody} from './commonTemplateBody.interface';

// TODO: This is the the old Sendgrid interface which have to be removed later
export interface AccountDisabledAdminsTemplateBody {
  adminFirstName: string;
  userFullName: string;
  userLocation: string;
  userTitle: string;
  userDepartment: string;
  userFunction: string;
  userDisableReason: string;
  myColleaguesUrl: string;
}

export interface UserDisabledTemplateBody extends CommonTemplateBody {
  ButtonURL: string;
  FirstName: string;
  FullName: string;
  Location: string;
  UserTitle: string;
  Department: string;
  Function: string;
  DisableReason: string;
}
