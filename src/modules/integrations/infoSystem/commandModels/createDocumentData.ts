import {MessageRecordType} from '../eventModels';
import {EntityNameInfoEnum} from '../eventModels/entityName.enum';

export interface CreateDocumentData {
  contactRecordType: MessageRecordType;
  entityName: EntityNameInfoEnum;
  docURL: string;
  documentID: string;
  fileName: string;
  fileNameAndExtension: string;
  entityId: string;
  description: string;
}
