import {CommonTemplateBody} from './commonTemplateBody.interface';

// TODO: This is the the old Sendgrid interface which have to be removed later
export interface StaffingRequestStatusChangedToSelectionTemplateBody {
  firstName: string;
  roleName: string;
  jobOrderName: string;
  loginUrl: string;
}

export interface StaffingRequestStatusSelectionTemplateBody extends CommonTemplateBody {
  ButtonURL: string;
  FirstName: string;
  RoleName: string;
  JobOrderId: string;
  JobOrderName: string;
}
