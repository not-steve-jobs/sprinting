import {ServiceTypeEnum} from '../../../modules/serviceType/serviceType.enum';
import {
  adeccoGermany,
  adeccoGroupSwi,
  adeccoLux,
  adeccoPol,
  adeccoSwi,
  adeccoUsa,
  adiaLux,
  badenochAndClarkGermany,
  badenochAndClarkSwi,
  daiGermany,
  disAgGermany,
  focore,
  genericSwi,
  lhhGermany,
  lhhSwi,
  modisGermany,
  mpGermany,
  pontoonGermany,
  pontoonSwi,
  springProGermany,
  springProSwi,
} from './tenant.data';

// NOTE: please add new serviceTypeData at the end of the file and don't change existing IDs
export const serviceTypeData: any[] = [
  {id: 1, name: ServiceTypeEnum.Temporary, tenantId: adeccoLux.id},

  {id: 2, name: ServiceTypeEnum.PermanentSuccess, tenantId: adeccoPol.id},
  {id: 3, name: ServiceTypeEnum.Temporary, tenantId: adeccoPol.id},

  // {id: 5, name: ServiceTypeEnum.PermanentRetained, tenantId: adeccoPol.id},
  {id: 6, name: ServiceTypeEnum.Temporary, tenantId: adeccoUsa.id},
  // {id: 7, name: 'Outsourcing', tenantId: 101},

  // {id: 8, name: 'Permanent', tenantId: 115},
  // {id: 9, name: 'Temporary', tenantId: 115},
  // {id: 10, name: 'Outsourcing', tenantId: 115},

  {id: 11, name: ServiceTypeEnum.Permanent, tenantId: adeccoSwi.id},
  // {id: 12, name: 'Temporary', tenantId: 137},
  // {id: 13, name: 'Outsourcing', tenantId: 137},

  // {id: 14, name: 'Permanent', tenantId: 174},
  // {id: 15, name: 'Temporary', tenantId: 174},
  // {id: 16, name: 'Outsourcing', tenantId: 174},

  {id: 17, name: ServiceTypeEnum.Temporary, tenantId: adiaLux.id},

  {id: 18, name: ServiceTypeEnum.Temporary, tenantId: adeccoSwi.id},
  {id: 19, name: ServiceTypeEnum.Temporary, tenantId: genericSwi.id},
  {id: 20, name: ServiceTypeEnum.Temporary, tenantId: adeccoGroupSwi.id},
  {id: 21, name: ServiceTypeEnum.Temporary, tenantId: badenochAndClarkSwi.id},
  {id: 22, name: ServiceTypeEnum.Temporary, tenantId: pontoonSwi.id},
  {id: 23, name: ServiceTypeEnum.Temporary, tenantId: springProSwi.id},

  {id: 24, name: ServiceTypeEnum.Temporary, tenantId: focore.id},
  {id: 25, name: ServiceTypeEnum.PermanentSuccess, tenantId: focore.id},

  {id: 26, name: ServiceTypeEnum.Temporary, tenantId: daiGermany.id},
  {id: 27, name: ServiceTypeEnum.Temporary, tenantId: mpGermany.id},
  {id: 28, name: ServiceTypeEnum.Temporary, tenantId: adeccoGermany.id},
  {id: 29, name: ServiceTypeEnum.Temporary, tenantId: modisGermany.id},
  {id: 30, name: ServiceTypeEnum.Temporary, tenantId: disAgGermany.id},
  {id: 31, name: ServiceTypeEnum.Temporary, tenantId: badenochAndClarkGermany.id},
  {id: 32, name: ServiceTypeEnum.Temporary, tenantId: pontoonGermany.id},
  {id: 33, name: ServiceTypeEnum.Temporary, tenantId: springProGermany.id},
  {id: 34, name: ServiceTypeEnum.Temporary, tenantId: lhhGermany.id},

  {id: 4, name: ServiceTypeEnum.Retained, tenantId: adeccoPol.id},
  {id: 35, name: ServiceTypeEnum.Retained, tenantId: focore.id},

  {id: 36, name: ServiceTypeEnum.Permanent, tenantId: lhhSwi.id},
  {id: 37, name: ServiceTypeEnum.Temporary, tenantId: lhhSwi.id},
];
