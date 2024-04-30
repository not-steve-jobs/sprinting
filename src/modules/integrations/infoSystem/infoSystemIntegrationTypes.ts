import {CreateContactData} from './commandModels/contactData';
import {CreateClientCaseCommentData, UpdateClientCaseCommentData} from './commandModels/clientCaseCommentData';
import {CreateClientCaseData} from './commandModels/createClientCaseData';
import {CreatePortalAccessData} from './commandModels/createPortalAccessData';
import {UpdateClientCaseData} from './commandModels/updateClientCaseData';
import {UpdatePortalAccessData} from './commandModels/updatePortalAccessData';
import {MessageRecordType} from './eventModels';
import {CreateDocumentData} from './commandModels/createDocumentData';
import {createJobSkillsData} from './commandModels/createJobSkillsData';

export enum InfoSystemCommands {
  createContact = 'createContact',
  updateContact = 'updateContact',
  createPortalAccess = 'createPortalAccess',
  updatePortalAccess = 'updatePortalAccess',
  createClientCase = 'createClientCase',
  updateClientCase = 'updateClientCase',
  createClientCaseComment = 'createClientCaseComment',
  updateCaseComment = 'updateCaseComment',
  createDocument = 'createDocument',
  createJob = 'createJob',
  createJobSkills = 'createJobSkills',
  updateJobProcess = 'updateJobProcess',
}

export enum InfoSystemEvents {
  contactCreated = 'contactCreated',
  contactUpdated = 'contactUpdated',
  accountCreated = 'accountCreated',
  accountUpdated = 'accountUpdated',
  clientAdminInvited = 'clientAdminInvited',
  portalAccessUpdated = 'portalAccessUpdated',
  clientCaseUpdated = 'clientCaseUpdated',
  clientCaseCommentCreated = 'clientCaseCommentCreated',
  jobProcessCreated = 'jobProcessCreated',
  jobProcessUpdated = 'jobProcessUpdated',
  jobUpdated = 'jobUpdated',
  branchCreated = 'branchCreated',
  branchUpdated = 'branchUpdated',
  branchAccountCreated = 'branchAccountCreated',
  branchAccountUpdated = 'branchAccountUpdated',
  jobCreated = 'jobCreated',
  jobSkillsCreated = 'jobSkillsCreated',
  jobSkillsUpdated = 'jobSkillsUpdated',
  jobSkillsDeleted = 'jobSkillsDeleted',
  documentCreated = 'documentCreated',
  personalDocumentCreated = 'personalDocumentCreated',
  bulkCustomerCreated = 'bulkCustomerCreated',
  bulkLocationCreated = 'bulkLocationCreated',
  bulkContactCreated = 'bulkContactCreated',
}

export type InfoSystemCommandWithParameters = {
  commandName: string;
  commandId: string;
  country?: string;
  brand?: string;
  parameters?: InfoSystemCommandParameters;
};

export type InfoSystemCommandParameters =
  | InfoSystemCommandParametersDefault
  | CreateContactData
  | CreatePortalAccessData
  | UpdatePortalAccessData
  | CreateClientCaseData
  | UpdateClientCaseData
  | CreateClientCaseCommentData
  | UpdateClientCaseCommentData
  | CreateDocumentData
  | CreatePortalAccessData
  | createJobSkillsData;

type InfoSystemCommandParametersDefault = {
  contactRecordType?: MessageRecordType;
  [key: string]: any;
};

export type InfoSystemCommand = InfoSystemCommandWithParameters;

export type InfoSystemCommandObject = {
  body: InfoSystemCommandParameters;
  applicationProperties: InfoSystemApplicationProperties;
};

export type InfoSystemApplicationProperties = {
  CommandName: string;
  DestinationSystem?: string;
};
