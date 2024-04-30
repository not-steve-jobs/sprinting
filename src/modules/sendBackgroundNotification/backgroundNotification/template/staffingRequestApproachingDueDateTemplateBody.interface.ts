import {CommonTemplateBody} from './commonTemplateBody.interface';

export interface StaffingRequestApproachingDueDateSendgridTemplateBody {
  firstName: string;
  jobOrderId: string;
  jobOrderName: string;
  jobOrderURL: string;
  loginUrl: string;
  buttonUrl: string;
}

export interface StaffingRequestApproachingDueDateTemplateBody extends CommonTemplateBody {
  FirstName: string;
  JobOrderName: string;
  JobOrderId: string;
}
