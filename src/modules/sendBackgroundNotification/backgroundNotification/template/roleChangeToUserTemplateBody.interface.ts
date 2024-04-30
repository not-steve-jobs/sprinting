import {CommonTemplateBody} from './commonTemplateBody.interface';

// TODO: This is the the old Sendgrid interface which have to be removed later
export interface RoleChangeToUserSendgridTemplateBody {
  firstName: string;
  loginUrl: string;
}

export interface RoleChangeToUserTemplateBody extends CommonTemplateBody {
  ButtonURL: string;
  FirstName: string;
}
