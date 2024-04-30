import {CommonTemplateBody} from './commonTemplateBody.interface';

// TODO: This is the the old Sendgrid interface which have to be removed later
export interface UserInvitationTemplateBody {
  firstName: string;
  adminFullName: string;
  url: string;
}

export interface UserInvitedTemplateBody extends CommonTemplateBody {
  ButtonURL: string;
  FirstName: string;
  AdminName: string;
}
