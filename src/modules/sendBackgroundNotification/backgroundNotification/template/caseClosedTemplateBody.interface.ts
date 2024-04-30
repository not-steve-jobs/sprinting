import {CommonTemplateBody} from './commonTemplateBody.interface';

// TODO: This is the the old Sendgrid interface which have to be removed later
export interface CaseClosedSendgridTemplateBody {
  firstName: string;
  caseName: string;
  url: string;
}

export interface CaseClosedTemplateBody extends CommonTemplateBody {
  ButtonURL: string;
  FirstName: string;
  CaseName: string;
}
