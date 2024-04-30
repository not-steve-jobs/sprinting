import {MessageRecordType} from '../eventModels';

export interface CreatePortalAccessData {
  contactRecordType: MessageRecordType;
  userId: string;
  locationId: string[];
  permissionId: string[];
  roleId: number;
  statusId: number;
}
