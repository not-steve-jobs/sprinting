import {MessageRecordType} from '../eventModels';

export interface UpdateClientCaseData {
  contactRecordType: MessageRecordType;
  id: string;
  statusId: number;
}
