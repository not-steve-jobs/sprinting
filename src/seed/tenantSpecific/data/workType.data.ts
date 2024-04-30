import {WorkType} from 'src/modules/workType/workType.enum';
import {adeccoUsa} from './tenant.data';

interface WorkTypeSeedItem {
  id: number;
  name: string;
  tenantId: number;
}

// NOTE: please add new workType data at the end of the file and don't change existing IDs
export const workTypeData: WorkTypeSeedItem[] = [
  {id: 1, name: WorkType.WorksiteBased, tenantId: adeccoUsa.id},
  {id: 2, name: WorkType.HomeBased, tenantId: adeccoUsa.id},
  {id: 3, name: WorkType.WorksiteAndHomeBased, tenantId: adeccoUsa.id},
];
