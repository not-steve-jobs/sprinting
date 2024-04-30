import {StatusOutOfBusinessTransco} from 'src/modules/transformations/entities/statusOutOfBusinessTransco.entity';
import {
  StatusOutOfBusinessTranscoData,
  TranscoTableData,
} from 'src/modules/transformations/enums/transformations.types';

export const statusOutOfBusinessTranscoData: StatusOutOfBusinessTranscoData[] = [
  {status: 'Active', outOfBusiness: false},
  {status: 'Disabled', outOfBusiness: true},
];

export const statusOutOfBusinessTranscoKeys = ['status'];

export const statusOutOfBusinessTranscoTableData: TranscoTableData = {
  entity: StatusOutOfBusinessTransco,
  data: statusOutOfBusinessTranscoData,
  primaryKeys: statusOutOfBusinessTranscoKeys,
};
