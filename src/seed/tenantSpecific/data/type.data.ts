import {Contract} from 'src/modules/contract/contract.entity';
import {TypeEnum} from '../../../modules/type/type.enum';
import {
  adeccoLux,
  adiaLux,
  adeccoPol,
  adeccoSwi,
  genericSwi,
  adeccoGroupSwi,
  badenochAndClarkSwi,
  pontoonSwi,
  springProSwi,
  focore,
  adeccoUsa,
  daiGermany,
  mpGermany,
  adeccoGermany,
  modisGermany,
  disAgGermany,
  badenochAndClarkGermany,
  pontoonGermany,
  springProGermany,
  lhhGermany,
  lhhSwi,
} from './tenant.data';

// NOTE: please add new types at the end of the file and don't change existing IDs
export const typeData: any[] = [
  // LUX
  // {id: 1, entityName: Contract.name, name: TypeEnum.Temp, tenantId: adeccoLux.id},
  {id: 2, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: adeccoLux.id},
  {id: 3, entityName: Contract.name, name: TypeEnum.ShortTermContract, tenantId: adeccoLux.id},
  {id: 4, entityName: Contract.name, name: TypeEnum.LongTermContract, tenantId: adeccoLux.id},

  // POL
  {id: 5, entityName: Contract.name, name: TypeEnum.TemporaryContract, tenantId: adeccoPol.id},
  {id: 6, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: adeccoPol.id},
  {id: 7, entityName: Contract.name, name: TypeEnum.CivilContract, tenantId: adeccoPol.id},
  // {id: 8, entityName: Contract.name, name: TypeEnum.TemporaryContract, tenantId: adeccoPol.id},
  {id: 9, entityName: Contract.name, name: TypeEnum.B2B, tenantId: adeccoPol.id},
  {id: 10, entityName: Contract.name, name: TypeEnum.EmploymentContract, tenantId: adeccoPol.id},

  // USA
  {id: 11, entityName: Contract.name, name: TypeEnum.StudentTemp, tenantId: adeccoUsa.id},
  {id: 12, entityName: Contract.name, name: TypeEnum.StudentPayroll, tenantId: adeccoUsa.id},

  // ITA
  // {id: 13, entityName: Contract.name, name: 'temp', tenantId: adeccoIta.id},
  // {id: 14, entityName: Contract.name, name: 'payroll', tenantId: adeccoIta.id},
  // {id: 15, entityName: Contract.name, name: 'studentTemp', tenantId: adeccoIta.id},
  // {id: 16, entityName: Contract.name, name: 'studentPayroll', tenantId: adeccoIta.id},

  // SWI
  // {id: 17, entityName: Contract.name, name: 'temp', tenantId: adeccoSwi.id},
  // {id: 18, entityName: Contract.name, name: 'payroll', tenantId: adeccoSwi.id},
  // {id: 19, entityName: Contract.name, name: 'studentTemp', tenantId: adeccoSwi.id},
  // {id: 20, entityName: Contract.name, name: 'studentPayroll', tenantId: adeccoSwi.id},

  // SPA
  // {id: 21, entityName: Contract.name, name: 'temp', tenantId: adeccoSpa.id},
  // {id: 22, entityName: Contract.name, name: 'payroll', tenantId: adeccoSpa.id},
  // {id: 23, entityName: Contract.name, name: 'studentTemp', tenantId: adeccoSpa.id},
  // {id: 24, entityName: Contract.name, name: 'studentPayroll', tenantId: adeccoSpa.id},

  // SPA
  {id: 25, entityName: Contract.name, name: TypeEnum.Temp, tenantId: adiaLux.id},
  {id: 26, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: adiaLux.id},
  {id: 27, entityName: Contract.name, name: TypeEnum.StudentTemp, tenantId: adiaLux.id},
  {id: 28, entityName: Contract.name, name: TypeEnum.StudentPayroll, tenantId: adiaLux.id},

  // adeccoSwi
  {id: 29, entityName: Contract.name, name: TypeEnum.Temp, tenantId: adeccoSwi.id},
  {id: 30, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: adeccoSwi.id},
  {id: 31, entityName: Contract.name, name: TypeEnum.StudentTemp, tenantId: adeccoSwi.id},
  {id: 32, entityName: Contract.name, name: TypeEnum.StudentPayroll, tenantId: adeccoSwi.id},

  // genericSwi
  {id: 33, entityName: Contract.name, name: TypeEnum.Temp, tenantId: genericSwi.id},
  {id: 34, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: genericSwi.id},
  {id: 35, entityName: Contract.name, name: TypeEnum.StudentTemp, tenantId: genericSwi.id},
  {id: 36, entityName: Contract.name, name: TypeEnum.StudentPayroll, tenantId: genericSwi.id},

  // adeccoGroupSwi
  {id: 37, entityName: Contract.name, name: TypeEnum.Temp, tenantId: adeccoGroupSwi.id},
  {id: 38, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: adeccoGroupSwi.id},
  {id: 39, entityName: Contract.name, name: TypeEnum.StudentTemp, tenantId: adeccoGroupSwi.id},
  {id: 40, entityName: Contract.name, name: TypeEnum.StudentPayroll, tenantId: adeccoGroupSwi.id},

  // badenochAndClarkSwi
  {id: 41, entityName: Contract.name, name: TypeEnum.Temp, tenantId: badenochAndClarkSwi.id},
  {id: 42, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: badenochAndClarkSwi.id},
  {id: 43, entityName: Contract.name, name: TypeEnum.StudentTemp, tenantId: badenochAndClarkSwi.id},
  {id: 44, entityName: Contract.name, name: TypeEnum.StudentPayroll, tenantId: badenochAndClarkSwi.id},

  // pontoonSwi
  {id: 45, entityName: Contract.name, name: TypeEnum.Temp, tenantId: pontoonSwi.id},
  {id: 46, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: pontoonSwi.id},
  {id: 47, entityName: Contract.name, name: TypeEnum.StudentTemp, tenantId: pontoonSwi.id},
  {id: 48, entityName: Contract.name, name: TypeEnum.StudentPayroll, tenantId: pontoonSwi.id},

  // springProSwi
  {id: 49, entityName: Contract.name, name: TypeEnum.Temp, tenantId: springProSwi.id},
  {id: 50, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: springProSwi.id},
  {id: 51, entityName: Contract.name, name: TypeEnum.StudentTemp, tenantId: springProSwi.id},
  {id: 52, entityName: Contract.name, name: TypeEnum.StudentPayroll, tenantId: springProSwi.id},

  // foCore
  {id: 53, entityName: Contract.name, name: TypeEnum.Temp, tenantId: focore.id},
  {id: 54, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: focore.id},
  {id: 55, entityName: Contract.name, name: TypeEnum.CivilContract, tenantId: focore.id},
  {id: 56, entityName: Contract.name, name: TypeEnum.B2B, tenantId: focore.id},
  {id: 57, entityName: Contract.name, name: TypeEnum.EmploymentContract, tenantId: focore.id},

  // adeccoUsa
  {id: 58, entityName: Contract.name, name: TypeEnum.Temp, tenantId: adeccoUsa.id},
  {id: 59, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: adeccoUsa.id},

  // DAIGermany
  {id: 60, entityName: Contract.name, name: TypeEnum.Temp, tenantId: daiGermany.id},
  {id: 61, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: daiGermany.id},

  // MPGermany
  {id: 62, entityName: Contract.name, name: TypeEnum.Temp, tenantId: mpGermany.id},
  {id: 63, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: mpGermany.id},

  // adeccoGermany
  {id: 64, entityName: Contract.name, name: TypeEnum.Temp, tenantId: adeccoGermany.id},
  {id: 65, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: adeccoGermany.id},

  // ModisGermany
  {id: 66, entityName: Contract.name, name: TypeEnum.Temp, tenantId: modisGermany.id},
  {id: 67, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: modisGermany.id},

  // DISAGGermany
  {id: 68, entityName: Contract.name, name: TypeEnum.Temp, tenantId: disAgGermany.id},
  {id: 69, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: disAgGermany.id},

  // badenochAndClarkGermany
  {id: 70, entityName: Contract.name, name: TypeEnum.Temp, tenantId: badenochAndClarkGermany.id},
  {id: 71, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: badenochAndClarkGermany.id},

  // pontoonGermany
  {id: 72, entityName: Contract.name, name: TypeEnum.Temp, tenantId: pontoonGermany.id},
  {id: 73, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: pontoonGermany.id},

  // springProGermany
  {id: 74, entityName: Contract.name, name: TypeEnum.Temp, tenantId: springProGermany.id},
  {id: 75, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: springProGermany.id},

  // LHHGermany
  {id: 76, entityName: Contract.name, name: TypeEnum.Temp, tenantId: lhhGermany.id},
  {id: 77, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: lhhGermany.id},

  // LHHSwi
  {id: 78, entityName: Contract.name, name: TypeEnum.Temp, tenantId: lhhSwi.id},
  {id: 79, entityName: Contract.name, name: TypeEnum.Payroll, tenantId: lhhSwi.id},
  {id: 80, entityName: Contract.name, name: TypeEnum.StudentTemp, tenantId: lhhSwi.id},
  {id: 81, entityName: Contract.name, name: TypeEnum.StudentPayroll, tenantId: lhhSwi.id},
];
