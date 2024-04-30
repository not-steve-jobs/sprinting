import {MessageRecordType} from '../eventModels';

export interface CreateClientCaseData {
  contactRecordType: MessageRecordType;
  additionalParameters: Record<string, string> | undefined;
  subject: string;
  description: string;
  locationId: string;
  entityId: string;
  caseId: string;
  category: number;
  createdBy: string;
  createdAt: Date;
}
