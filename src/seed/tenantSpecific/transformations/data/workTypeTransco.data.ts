import {WorkTypeTransco} from 'src/modules/transformations/entities/workTypeTransco.entity';
import {
  Brands,
  WorkTypeTranscoData,
  Country,
  JobWorkType,
  TranscoTableData,
} from 'src/modules/transformations/enums/transformations.types';

export const workTypeTranscoData: WorkTypeTranscoData[] = [
  {workTypeId: 1, workType: JobWorkType.WORKSITE, brand: Brands.ADECCO, country: Country.US},
  {workTypeId: 2, workType: JobWorkType.HOME, brand: Brands.ADECCO, country: Country.US},
  {workTypeId: 3, workType: JobWorkType.WORKSITE_AND_HOME, brand: Brands.ADECCO, country: Country.US},
];

export const workTypeTranscoKeys = ['country', 'brand', 'workTypeId'];

export const workTypeTranscoTableData: TranscoTableData = {
  entity: WorkTypeTransco,
  data: workTypeTranscoData,
  primaryKeys: workTypeTranscoKeys,
};
