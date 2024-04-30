import {RatePeriodTransco} from 'src/modules/transformations/entities/ratePeriodTransco.entity';
import {
  Brands,
  Country,
  PERIOD,
  RatePeriodTranscoData,
  TranscoTableData,
} from 'src/modules/transformations/enums/transformations.types';

export const ratePeriodTranscoData: RatePeriodTranscoData[] = [
  {rateId: 1, payRatePeriod: PERIOD.HOURLY, country: Country.PL, brand: Brands.ADECCO},
  {rateId: 2, payRatePeriod: PERIOD.DAILY, country: Country.PL, brand: Brands.ADECCO},
  {rateId: 3, payRatePeriod: PERIOD.WEEKLY, country: Country.PL, brand: Brands.ADECCO},
  {rateId: 4, payRatePeriod: PERIOD.MONTHLY, country: Country.PL, brand: Brands.ADECCO},
  {rateId: 19, payRatePeriod: PERIOD.YEARLY, country: Country.PL, brand: Brands.ADECCO},
  {rateId: 5, payRatePeriod: PERIOD.HOURLY, country: Country.LU, brand: Brands.ADECCO},
  {rateId: 6, payRatePeriod: PERIOD.DAILY, country: Country.LU, brand: Brands.ADECCO},
  {rateId: 7, payRatePeriod: PERIOD.WEEKLY, country: Country.LU, brand: Brands.ADECCO},
  {rateId: 8, payRatePeriod: PERIOD.MONTHLY, country: Country.LU, brand: Brands.ADECCO},
  {rateId: 20, payRatePeriod: PERIOD.YEARLY, country: Country.LU, brand: Brands.ADECCO},
  {rateId: 13, payRatePeriod: PERIOD.HOURLY, country: Country.CH, brand: Brands.ADECCO},
  {rateId: 42, payRatePeriod: PERIOD.DAILY, country: Country.CH, brand: Brands.ADECCO},
  {rateId: 43, payRatePeriod: PERIOD.WEEKLY, country: Country.CH, brand: Brands.ADECCO},
  {rateId: 44, payRatePeriod: PERIOD.MONTHLY, country: Country.CH, brand: Brands.ADECCO},
  {rateId: 45, payRatePeriod: PERIOD.YEARLY, country: Country.CH, brand: Brands.ADECCO},
  {rateId: 47, payRatePeriod: PERIOD.HOURLY, country: Country.AF, brand: Brands.ADECCO},
  {rateId: 46, payRatePeriod: PERIOD.DAILY, country: Country.AF, brand: Brands.ADECCO},
  {rateId: 49, payRatePeriod: PERIOD.WEEKLY, country: Country.AF, brand: Brands.ADECCO},
  {rateId: 48, payRatePeriod: PERIOD.MONTHLY, country: Country.AF, brand: Brands.ADECCO},
  {rateId: 47, payRatePeriod: PERIOD.HOURLY, country: Country.FC, brand: Brands.FOCORE},
  {rateId: 46, payRatePeriod: PERIOD.DAILY, country: Country.FC, brand: Brands.FOCORE},
  {rateId: 49, payRatePeriod: PERIOD.WEEKLY, country: Country.FC, brand: Brands.FOCORE},
  {rateId: 48, payRatePeriod: PERIOD.MONTHLY, country: Country.FC, brand: Brands.FOCORE},
  {rateId: 100, payRatePeriod: PERIOD.YEARLY, country: Country.FC, brand: Brands.FOCORE},
];

export const ratePeriodTranscoKeys = ['country', 'brand', 'rateId'];

export const ratePeriodTranscoTableData: TranscoTableData = {
  entity: RatePeriodTransco,
  data: ratePeriodTranscoData,
  primaryKeys: ratePeriodTranscoKeys,
};
