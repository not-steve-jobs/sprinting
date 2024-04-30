import {MessageRecordType} from '../eventModels';

export interface CreateClientCaseCommentData {
  contactRecordType: MessageRecordType;
  caseId: string;
  clientContactName: string;
  commentBody: string;
}

export type UpdateClientCaseCommentData = CreateClientCaseCommentData;
