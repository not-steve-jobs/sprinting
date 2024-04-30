import {JobRoleTransco} from 'src/modules/transformations/entities/JobRoleTransco.entity';
import {
  Brands,
  JobRoleTranscoData,
  Country,
  TranscoTableData,
} from 'src/modules/transformations/enums/transformations.types';

export const jobRoleTranscoData: JobRoleTranscoData[] = [
  {jobRoleId: '00000000-0000-4000-0000-000000000038', jobRole: 'Cleaner', brand: Brands.ADECCO, country: Country.US},
  {
    jobRoleId: '00000000-0000-4000-0000-000000000039',
    jobRole: 'Car Mechanic',
    brand: Brands.ADECCO,
    country: Country.US,
  },
  {
    jobRoleId: '00000000-0000-4000-0000-000000000040',
    jobRole: 'Loader Unloader',
    brand: Brands.ADECCO,
    country: Country.US,
  },
  {
    jobRoleId: '00000000-0000-4000-0000-000000000041',
    jobRole: 'Forklift Truck Driver',
    brand: Brands.ADECCO,
    country: Country.US,
  },
  {
    jobRoleId: '00000000-0000-4000-0000-000000000042',
    jobRole: 'Employee Back Office',
    brand: Brands.ADECCO,
    country: Country.US,
  },
  {
    jobRoleId: '00000000-0000-4000-0000-000000000043',
    jobRole: 'Electrical Engineer',
    brand: Brands.ADECCO,
    country: Country.US,
  },
  {jobRoleId: '00000000-0000-4000-0000-000000000081', jobRole: 'carpenter', brand: Brands.ADECCO, country: Country.US},
];

export const jobRoleTranscoKeys = ['country', 'brand', 'jobRoleId'];

export const jobRoleTranscoTableData: TranscoTableData = {
  entity: JobRoleTransco,
  data: jobRoleTranscoData,
  primaryKeys: jobRoleTranscoKeys,
};
