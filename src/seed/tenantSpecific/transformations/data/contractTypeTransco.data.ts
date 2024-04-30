import {ContractTypeTransco} from 'src/modules/transformations/entities/contractTypeTransco.entity';
import {
  Brands,
  ContractTypeTranscoData,
  Country,
  JobContractType,
  TranscoTableData,
} from 'src/modules/transformations/enums/transformations.types';

export const contractTypeTranscoData: ContractTypeTranscoData[] = [
  {contractTypeId: 2, contractType: JobContractType.PAYROLL, brand: Brands.ADECCO, country: Country.LU},
  {contractTypeId: 3, contractType: JobContractType.SHORT_TERM_CONTRACT, brand: Brands.ADECCO, country: Country.LU},
  {contractTypeId: 4, contractType: JobContractType.LONG_TERM_CONTRACT, brand: Brands.ADECCO, country: Country.LU},
  {contractTypeId: 5, contractType: JobContractType.TEMPORARY_CONTRACT, brand: Brands.ADECCO, country: Country.PL},
  {contractTypeId: 6, contractType: JobContractType.PAYROLL, brand: Brands.ADECCO, country: Country.PL},
  {contractTypeId: 7, contractType: JobContractType.CIVIL_CONTRACT, brand: Brands.ADECCO, country: Country.PL},
  {contractTypeId: 9, contractType: JobContractType.B2B, brand: Brands.ADECCO, country: Country.PL},
  {contractTypeId: 10, contractType: JobContractType.EMPLOYMENT_CONTRACT, brand: Brands.ADECCO, country: Country.PL},
  {contractTypeId: 29, contractType: JobContractType.TEMP, brand: Brands.ADECCO, country: Country.CH},
  {contractTypeId: 30, contractType: JobContractType.PAYROLL, brand: Brands.ADECCO, country: Country.CH},
  {contractTypeId: 31, contractType: JobContractType.STUDENT_TEMP, brand: Brands.ADECCO, country: Country.CH},
  {contractTypeId: 32, contractType: JobContractType.STUDENT_PAYROLL, brand: Brands.ADECCO, country: Country.CH},
  {contractTypeId: 53, contractType: JobContractType.TEMPORARY_CONTRACT, brand: Brands.ADECCO, country: Country.AF},
  {contractTypeId: 54, contractType: JobContractType.PAYROLL, brand: Brands.ADECCO, country: Country.AF},
  {contractTypeId: 55, contractType: JobContractType.CIVIL_CONTRACT, brand: Brands.ADECCO, country: Country.AF},
  {contractTypeId: 56, contractType: JobContractType.B2B, brand: Brands.ADECCO, country: Country.AF},
  {contractTypeId: 57, contractType: JobContractType.EMPLOYMENT_CONTRACT, brand: Brands.ADECCO, country: Country.AF},
  {contractTypeId: 53, contractType: JobContractType.TEMPORARY_CONTRACT, brand: Brands.FOCORE, country: Country.FC},
  {contractTypeId: 54, contractType: JobContractType.PAYROLL, brand: Brands.FOCORE, country: Country.FC},
  {contractTypeId: 55, contractType: JobContractType.CIVIL_CONTRACT, brand: Brands.FOCORE, country: Country.FC},
  {contractTypeId: 56, contractType: JobContractType.B2B, brand: Brands.FOCORE, country: Country.FC},
  {contractTypeId: 57, contractType: JobContractType.EMPLOYMENT_CONTRACT, brand: Brands.FOCORE, country: Country.FC},
];

export const contractTypeTranscoKeys = ['country', 'brand', 'contractTypeId'];

export const contractTypeTranscoTableData: TranscoTableData = {
  entity: ContractTypeTransco,
  data: contractTypeTranscoData,
  primaryKeys: contractTypeTranscoKeys,
};
