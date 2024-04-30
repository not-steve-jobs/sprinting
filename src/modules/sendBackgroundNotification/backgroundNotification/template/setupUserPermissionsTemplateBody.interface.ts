import {CommonTemplateBody} from './commonTemplateBody.interface';

// TODO: Remove this once the Sendgrid provider is disabled
export interface SetupUserPermissionsSendgridTemplateBody {
  firstName: string;
  userName: string;
  myColleaguesUrl: string;
}

export interface SetupUserPermissionsTemplateBody extends CommonTemplateBody {
  ButtonURL: string;
  FirstName: string;
  UserName: string;
}
