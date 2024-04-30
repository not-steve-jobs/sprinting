import {ServiceTypeRecordTypeTransco} from 'src/modules/transformations/entities/serviceTypeRecordTypeTransco.entity';
import {
  Brands,
  Country,
  ServiceTypeRecordTypeTranscoData,
  TranscoTableData,
} from 'src/modules/transformations/enums/transformations.types';

export const serviceTypeRecordTypeTranscoData: ServiceTypeRecordTypeTranscoData[] = [
  {serviceTypeId: 1, recordTypeDeveloperName: 'Consulting', brand: Brands.ADECCO, country: Country.LU},
  {serviceTypeId: 2, recordTypeDeveloperName: 'Permanent', brand: Brands.ADECCO, country: Country.PL},
  {serviceTypeId: 3, recordTypeDeveloperName: 'Consulting', brand: Brands.ADECCO, country: Country.PL},
  {serviceTypeId: 4, recordTypeDeveloperName: 'Retained', brand: Brands.ADECCO, country: Country.PL},
  {serviceTypeId: 18, recordTypeDeveloperName: 'Consulting', brand: Brands.ADECCO, country: Country.CH},
  {serviceTypeId: 24, recordTypeDeveloperName: 'Consulting', brand: Brands.ADECCO, country: Country.AF},
  {serviceTypeId: 25, recordTypeDeveloperName: 'Permanent', brand: Brands.ADECCO, country: Country.AF},
  {serviceTypeId: 24, recordTypeDeveloperName: 'Consulting', brand: Brands.FOCORE, country: Country.FC},
  {serviceTypeId: 25, recordTypeDeveloperName: 'Permanent', brand: Brands.FOCORE, country: Country.FC},
  {serviceTypeId: 35, recordTypeDeveloperName: 'Retained', brand: Brands.FOCORE, country: Country.FC},
  {serviceTypeId: 11, recordTypeDeveloperName: 'studentTemp', brand: Brands.ADECCO, country: Country.US},
  {serviceTypeId: 12, recordTypeDeveloperName: 'studentPayroll', brand: Brands.ADECCO, country: Country.US},
  {serviceTypeId: 6, recordTypeDeveloperName: 'temp', brand: Brands.ADECCO, country: Country.US},
];

// TODO: Add different values for Retained.

export const serviceTypeRecordTypeTranscoKeys = ['serviceTypeId', 'brand', 'country'];

export const serviceTypeRecordTypeTranscoTableData: TranscoTableData = {
  entity: ServiceTypeRecordTypeTransco,
  data: serviceTypeRecordTypeTranscoData,
  primaryKeys: serviceTypeRecordTypeTranscoKeys,
};
