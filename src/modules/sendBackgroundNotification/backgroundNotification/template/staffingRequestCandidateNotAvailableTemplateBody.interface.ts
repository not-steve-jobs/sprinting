import {CommonTemplateBody} from './commonTemplateBody.interface';

export interface StaffingRequestCandidateNotAvailableSendgridTemplateBody {
  firstName: string;
  roleName: string;
  jobOrderName: string;
  jobOrderURL: string;
  jobOrderAssociateId: string;
  loginUrl: string;
  buttonUrl: string;
}

export interface StaffingRequestCandidateNotAvailableTemplateBody extends CommonTemplateBody {
  FirstName: string;
  RoleName: string;
  JobOrderAssociateId: string;
  JobOrderName: string;
}
