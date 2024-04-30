import {ClientProfile} from 'src/modules/clientProfile/clientProfile.entity';

export interface CreateContactData {
  firstName: string;
  lastName: string;
  phone: string;
  otherPhone: string;
  email: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  countryCode: string;
  zip: string;
  title: string;
  permission: string;
  escalationTimesheetApprover: string;
  externalCustomerId: string;
  statusSF: string;
  billToInvoiceEmail: string;
  departmentText: string;
  role: string;
  status: string;
  WorkerLocation: string[];
  branchCostCenter: string;
}

export interface UpdateContactData extends CreateContactData {
  externalContactId: string;
}

export interface CreateContactAdditionalData {
  clientProfile: ClientProfile;
  permissionNames: string[];
  externalLocationIds: string[];
}
