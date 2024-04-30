import {CreateContactData, UpdateContactData} from './commandModels/contactData';
import {CreateJobData} from './commandModels/jobData';

export enum SalesForceEvents {
  customerCreated = 'customerCreated',
  accountCreated = 'accountCreated',
  customerUpdated = 'customerUpdated',
  accountUpdated = 'accountUpdated',
  contactCreated = 'contactCreated',
  contactUpdated = 'contactUpdated',
  clientAdminInvited = 'clientAdminInvited',
  jobCreated = 'jobCreated',
}

export enum SalesForceCommands {
  createContact = 'createContact',
  updateContact = 'updateContact',
  createJob = 'createJob',
  updateJob = 'updateJob',
  updateCustomer = 'updateCustomer',
}

export type SalesForceCommandParameters =
  | SalesForceCommandParametersDefault
  | CreateContactData
  | UpdateContactData
  | CreateJobData;

type SalesForceCommandParametersDefault = {
  [key: string]: any;
};

export type SalesForceCommandWithParameters = {
  commandName: string;
  commandId: string;
  country?: string;
  brand?: string;
  parameters?: SalesForceCommandParameters;
};

export type SalesForceCommand = SalesForceCommandWithParameters;

export type SalesForceCommandObject = {
  body: SalesForceCommandWithParameters;
  applicationProperties: SalesForceApplicationProperties;
};

export type SalesForceApplicationProperties = {
  CommandName: string;
  DestinationSystem?: string;
};
