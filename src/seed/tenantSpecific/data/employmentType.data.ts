import {PlainObject} from '../../../modules/common/common.dto';
import {EmploymentType} from '../../../modules/employmentType/employmentType.enum';
import {
  adeccoGroupSwi,
  adeccoLux,
  adeccoPol,
  adeccoSwi,
  adeccoUsa,
  adiaLux,
  badenochAndClarkSwi,
  focore,
  genericSwi,
  lhhSwi,
  pontoonSwi,
  springProSwi,
} from './tenant.data';

// NOTE: please add new records at the end of the file and don't change existing IDs
export const employmentTypeData: PlainObject[] = [
  {id: 1, tenantId: adeccoPol.id, name: EmploymentType.FullTime},
  {id: 2, tenantId: adeccoPol.id, name: EmploymentType.PartTime},

  {id: 3, tenantId: adeccoLux.id, name: EmploymentType.FullTime},
  {id: 4, tenantId: adeccoLux.id, name: EmploymentType.PartTime},

  {id: 5, tenantId: adiaLux.id, name: EmploymentType.FullTime},
  {id: 6, tenantId: adiaLux.id, name: EmploymentType.PartTime},

  {id: 7, tenantId: adeccoSwi.id, name: EmploymentType.FullTime},
  {id: 8, tenantId: adeccoSwi.id, name: EmploymentType.PartTime},

  {id: 9, tenantId: genericSwi.id, name: EmploymentType.FullTime},
  {id: 10, tenantId: genericSwi.id, name: EmploymentType.PartTime},

  {id: 11, tenantId: adeccoGroupSwi.id, name: EmploymentType.FullTime},
  {id: 12, tenantId: adeccoGroupSwi.id, name: EmploymentType.PartTime},

  {id: 13, tenantId: badenochAndClarkSwi.id, name: EmploymentType.FullTime},
  {id: 14, tenantId: badenochAndClarkSwi.id, name: EmploymentType.PartTime},

  {id: 15, tenantId: pontoonSwi.id, name: EmploymentType.FullTime},
  {id: 16, tenantId: pontoonSwi.id, name: EmploymentType.PartTime},

  {id: 17, tenantId: springProSwi.id, name: EmploymentType.FullTime},
  {id: 18, tenantId: springProSwi.id, name: EmploymentType.PartTime},

  {id: 19, tenantId: focore.id, name: EmploymentType.FullTime},
  {id: 20, tenantId: focore.id, name: EmploymentType.PartTime},

  {id: 21, tenantId: adeccoUsa.id, name: EmploymentType.FullTime},
  {id: 22, tenantId: adeccoUsa.id, name: EmploymentType.PartTime},

  {id: 23, tenantId: lhhSwi.id, name: EmploymentType.FullTime},
  {id: 24, tenantId: lhhSwi.id, name: EmploymentType.PartTime},
];
