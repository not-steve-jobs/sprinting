import {LocationAccountTransco} from 'src/modules/transformations/entities/LocationAccountTransco.entity';
import {LocationAccountTranscoData, TranscoTableData} from 'src/modules/transformations/enums/transformations.types';

const description = 'send null instead of locationId';

export const locationAccountTranscoData: LocationAccountTranscoData[] = [
  {accountConcernedGuid: null, locationId: null, category: 1, description},
  {accountConcernedGuid: null, locationId: null, category: 2, description},
  {accountConcernedGuid: null, locationId: null, category: 3, description},
  {accountConcernedGuid: null, locationId: null, category: 4, description},
  {accountConcernedGuid: null, locationId: null, category: 5, description},
];

export const locationAccountTranscoKeys = ['category'];

export const locationAccountTranscoTableData: TranscoTableData = {
  entity: LocationAccountTransco,
  data: locationAccountTranscoData,
  primaryKeys: locationAccountTranscoKeys,
};
