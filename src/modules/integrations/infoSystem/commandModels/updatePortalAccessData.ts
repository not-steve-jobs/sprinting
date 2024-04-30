import {MessageRecordType} from '../eventModels';

export interface UpdatePortalAccessData {
  contactRecordType: MessageRecordType;
  userId: string;
  locationId: string[];
  permissionId: string[];
  statusId: number;
  disableReasonId: string;
  disableReasonOther: string;
}
