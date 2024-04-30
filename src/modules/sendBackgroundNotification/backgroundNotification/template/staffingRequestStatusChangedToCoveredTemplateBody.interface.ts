import {CommonTemplateBody} from './commonTemplateBody.interface';

// TODO: This is the the old Sendgrid interface which have to be removed later
export interface StaffingRequestStatusChangedToCoveredTemplateBody {
  firstName: string;
  roleName: string;
  jobOrderName: string;
  numberOfOpenings: number;
  loginUrl: string;
}

export interface StaffingRequestStatusCoveredTemplateBody extends CommonTemplateBody {
  ButtonURL: string;
  FirstName: string;
  RoleName: string;
  NumberOfOpenings: number;
  JobOrderName: string;
}
