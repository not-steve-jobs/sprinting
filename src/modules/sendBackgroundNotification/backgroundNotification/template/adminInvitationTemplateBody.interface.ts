import {CommonTemplateBody} from './commonTemplateBody.interface';

// TODO: This is the the old Sendgrid interface which have to be removed later
export interface AdminInvitationTemplateBody {
  firstName: string;
  url: string;
}

export interface AdminInvitedTemplateBody extends CommonTemplateBody {
  ButtonURL: string;
  FirstName: string;
}
