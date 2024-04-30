import {CommonTemplateBody} from './commonTemplateBody.interface';

// TODO: This is the the old Sendgrid interface which have to be removed later
export interface StaffingRequestStatusChangedToInProgressTemplateBody {
  firstName: string;
  roleName: string;
  jobOrderName: string;
  loginUrl: string;
}

export interface StaffingRequestStatusInProgressTemplateBody extends CommonTemplateBody {
  ButtonURL: string;
  FirstName: string;
  RoleName: string;
  JobOrderName: string;
}
