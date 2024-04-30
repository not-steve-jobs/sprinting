import {JobOrderStatusTransco} from 'src/modules/transformations/entities/JobOrderStatusTransco.entity';
import {
  Brands,
  JobOrderStatusTranscoData,
  Country,
  TranscoTableData,
} from 'src/modules/transformations/enums/transformations.types';

export const jobOrderStatusTranscoData: JobOrderStatusTranscoData[] = [
  {statusId: 82, status: 'Draft', brand: Brands.ADECCO, country: Country.US},
  {statusId: 83, status: 'Draft', brand: Brands.ADECCO, country: Country.US},
  {statusId: 84, status: 'Accepting candidates', brand: Brands.ADECCO, country: Country.US},
  {statusId: 85, status: 'Accepting candidates', brand: Brands.ADECCO, country: Country.US},
  {statusId: 86, status: 'Placed', brand: Brands.ADECCO, country: Country.US},
  {statusId: 87, status: 'Canceled', brand: Brands.ADECCO, country: Country.US},
  {statusId: 88, status: 'Declined', brand: Brands.ADECCO, country: Country.US},
  {statusId: 89, status: 'Placed', brand: Brands.ADECCO, country: Country.US},
  {statusId: 493, status: 'Accepting candidates', brand: Brands.ADECCO, country: Country.US},
  {statusId: 494, status: 'Accepting candidates', brand: Brands.ADECCO, country: Country.US},
];

export const jobOrderStatusTranscoKeys = ['country', 'brand', 'statusId'];

export const jobOrderStatusTranscoTableData: TranscoTableData = {
  entity: JobOrderStatusTransco,
  data: jobOrderStatusTranscoData,
  primaryKeys: jobOrderStatusTranscoKeys,
};
