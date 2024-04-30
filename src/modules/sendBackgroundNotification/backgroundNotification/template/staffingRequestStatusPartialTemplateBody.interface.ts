import {CommonTemplateBody} from './commonTemplateBody.interface';

// TODO: This is the the old Sendgrid interface which have to be removed later
export interface StaffingRequestStatusChangedToPartialTemplateBody {
  firstName: string;
  roleName: string;
  jobOrderName: string;
  numberOfPlacements: number;
  loginUrl: string;
}

export interface StaffingRequestStatusPartialTemplateBody extends CommonTemplateBody {
  ButtonURL: string;
  FirstName: string;
  RoleName: string;
  NumberOfPlacements: number;
  JobOrderName: string;
}
