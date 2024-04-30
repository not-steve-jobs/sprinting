import {MessageRecordType} from '../eventModels';

export interface CreateContactData {
  contactRecordType: MessageRecordType;
  userId: string;
  mainLocation: string;
  email: string;
  firstName: string;
  lastName: string;
  deptFunctionId: string;
  deptId: string;
  customDepartment: string;
  title: string;
  phone: string;
  phonePrefix: string;
  otherPhone: string;
  phonePrefixOtherPhone: string;
  notification?: boolean;
  invitedByUserId: string;
  language: string;
}

export type UpdateContactData = CreateContactData;
