import {RateEnum} from '../../../modules/rate/rate.enum';
import {PlainObject} from '../../../modules/common/common.dto';
import {
  adeccoPol,
  adeccoLux,
  adiaLux,
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

// NOTE: please add new rates at the end of the file and don't change existing IDs
export const rateData: PlainObject[] = [
  {id: 1, tenantId: adeccoPol.id, name: RateEnum.Hourly},
  {id: 2, tenantId: adeccoPol.id, name: RateEnum.Daily},
  {id: 3, tenantId: adeccoPol.id, name: RateEnum.Weekly},
  {id: 4, tenantId: adeccoPol.id, name: RateEnum.Monthly},

  {id: 5, tenantId: adeccoLux.id, name: RateEnum.Hourly},
  {id: 6, tenantId: adeccoLux.id, name: RateEnum.Daily},
  {id: 7, tenantId: adeccoLux.id, name: RateEnum.Weekly},
  {id: 8, tenantId: adeccoLux.id, name: RateEnum.Monthly},

  {id: 9, tenantId: adiaLux.id, name: RateEnum.Hourly},
  {id: 10, tenantId: adiaLux.id, name: RateEnum.Daily},
  {id: 11, tenantId: adiaLux.id, name: RateEnum.Weekly},
  {id: 12, tenantId: adiaLux.id, name: RateEnum.Monthly},

  {id: 13, tenantId: adeccoSwi.id, name: RateEnum.Hourly},

  {id: 14, tenantId: genericSwi.id, name: RateEnum.Hourly},

  {id: 15, tenantId: adeccoGroupSwi.id, name: RateEnum.Hourly},

  {id: 16, tenantId: badenochAndClarkSwi.id, name: RateEnum.Hourly},

  {id: 17, tenantId: pontoonSwi.id, name: RateEnum.Hourly},

  {id: 18, tenantId: springProSwi.id, name: RateEnum.Hourly},

  {id: 19, tenantId: adeccoPol.id, name: RateEnum.Yearly},
  {id: 20, tenantId: adeccoLux.id, name: RateEnum.Yearly},
  {id: 21, tenantId: adiaLux.id, name: RateEnum.Yearly},

  {id: 22, tenantId: genericSwi.id, name: RateEnum.Daily},
  {id: 23, tenantId: genericSwi.id, name: RateEnum.Weekly},
  {id: 24, tenantId: genericSwi.id, name: RateEnum.Monthly},
  {id: 25, tenantId: genericSwi.id, name: RateEnum.Yearly},

  {id: 26, tenantId: adeccoGroupSwi.id, name: RateEnum.Daily},
  {id: 27, tenantId: adeccoGroupSwi.id, name: RateEnum.Weekly},
  {id: 28, tenantId: adeccoGroupSwi.id, name: RateEnum.Monthly},
  {id: 29, tenantId: adeccoGroupSwi.id, name: RateEnum.Yearly},

  {id: 30, tenantId: badenochAndClarkSwi.id, name: RateEnum.Daily},
  {id: 31, tenantId: badenochAndClarkSwi.id, name: RateEnum.Weekly},
  {id: 32, tenantId: badenochAndClarkSwi.id, name: RateEnum.Monthly},
  {id: 33, tenantId: badenochAndClarkSwi.id, name: RateEnum.Yearly},

  {id: 34, tenantId: pontoonSwi.id, name: RateEnum.Daily},
  {id: 35, tenantId: pontoonSwi.id, name: RateEnum.Weekly},
  {id: 36, tenantId: pontoonSwi.id, name: RateEnum.Monthly},
  {id: 37, tenantId: pontoonSwi.id, name: RateEnum.Yearly},

  {id: 38, tenantId: springProSwi.id, name: RateEnum.Daily},
  {id: 39, tenantId: springProSwi.id, name: RateEnum.Weekly},
  {id: 40, tenantId: springProSwi.id, name: RateEnum.Monthly},
  {id: 41, tenantId: springProSwi.id, name: RateEnum.Yearly},

  {id: 42, tenantId: adeccoSwi.id, name: RateEnum.Daily},
  {id: 43, tenantId: adeccoSwi.id, name: RateEnum.Weekly},
  {id: 44, tenantId: adeccoSwi.id, name: RateEnum.Monthly},
  {id: 45, tenantId: adeccoSwi.id, name: RateEnum.Yearly},

  {id: 46, tenantId: focore.id, name: RateEnum.Daily},
  {id: 47, tenantId: focore.id, name: RateEnum.Hourly},
  {id: 48, tenantId: focore.id, name: RateEnum.Monthly},
  {id: 49, tenantId: focore.id, name: RateEnum.Weekly},

  {id: 50, tenantId: adeccoUsa.id, name: RateEnum.Hourly},
  {id: 51, tenantId: adeccoUsa.id, name: RateEnum.Daily},
  {id: 52, tenantId: adeccoUsa.id, name: RateEnum.Weekly},
  {id: 53, tenantId: adeccoUsa.id, name: RateEnum.Monthly},
  {id: 54, tenantId: adeccoUsa.id, name: RateEnum.Yearly},

  //DAIGermany
  {id: 55, tenantId: daiGermany.id, name: RateEnum.Hourly},
  {id: 56, tenantId: daiGermany.id, name: RateEnum.Daily},
  {id: 57, tenantId: daiGermany.id, name: RateEnum.Weekly},
  {id: 58, tenantId: daiGermany.id, name: RateEnum.Monthly},
  {id: 59, tenantId: daiGermany.id, name: RateEnum.Yearly},

  //MPGermany
  {id: 60, tenantId: mpGermany.id, name: RateEnum.Hourly},
  {id: 61, tenantId: mpGermany.id, name: RateEnum.Daily},
  {id: 62, tenantId: mpGermany.id, name: RateEnum.Weekly},
  {id: 63, tenantId: mpGermany.id, name: RateEnum.Monthly},
  {id: 64, tenantId: mpGermany.id, name: RateEnum.Yearly},

  //adeccoGermany
  {id: 65, tenantId: adeccoGermany.id, name: RateEnum.Hourly},
  {id: 66, tenantId: adeccoGermany.id, name: RateEnum.Daily},
  {id: 67, tenantId: adeccoGermany.id, name: RateEnum.Weekly},
  {id: 68, tenantId: adeccoGermany.id, name: RateEnum.Monthly},
  {id: 69, tenantId: adeccoGermany.id, name: RateEnum.Yearly},

  //ModisGermany
  {id: 70, tenantId: modisGermany.id, name: RateEnum.Hourly},
  {id: 71, tenantId: modisGermany.id, name: RateEnum.Daily},
  {id: 72, tenantId: modisGermany.id, name: RateEnum.Weekly},
  {id: 73, tenantId: modisGermany.id, name: RateEnum.Monthly},
  {id: 74, tenantId: modisGermany.id, name: RateEnum.Yearly},

  //DISAGGermany
  {id: 75, tenantId: disAgGermany.id, name: RateEnum.Hourly},
  {id: 76, tenantId: disAgGermany.id, name: RateEnum.Daily},
  {id: 77, tenantId: disAgGermany.id, name: RateEnum.Weekly},
  {id: 78, tenantId: disAgGermany.id, name: RateEnum.Monthly},
  {id: 79, tenantId: disAgGermany.id, name: RateEnum.Yearly},

  //badenochAndClarkGermany
  {id: 80, tenantId: badenochAndClarkGermany.id, name: RateEnum.Hourly},
  {id: 81, tenantId: badenochAndClarkGermany.id, name: RateEnum.Daily},
  {id: 82, tenantId: badenochAndClarkGermany.id, name: RateEnum.Weekly},
  {id: 83, tenantId: badenochAndClarkGermany.id, name: RateEnum.Monthly},
  {id: 84, tenantId: badenochAndClarkGermany.id, name: RateEnum.Yearly},

  //pontoonGermany
  {id: 85, tenantId: pontoonGermany.id, name: RateEnum.Hourly},
  {id: 86, tenantId: pontoonGermany.id, name: RateEnum.Daily},
  {id: 87, tenantId: pontoonGermany.id, name: RateEnum.Weekly},
  {id: 88, tenantId: pontoonGermany.id, name: RateEnum.Monthly},
  {id: 89, tenantId: pontoonGermany.id, name: RateEnum.Yearly},

  //springProGermany
  {id: 90, tenantId: springProGermany.id, name: RateEnum.Hourly},
  {id: 91, tenantId: springProGermany.id, name: RateEnum.Daily},
  {id: 92, tenantId: springProGermany.id, name: RateEnum.Weekly},
  {id: 93, tenantId: springProGermany.id, name: RateEnum.Monthly},
  {id: 94, tenantId: springProGermany.id, name: RateEnum.Yearly},

  //LHHGermany
  {id: 95, tenantId: lhhGermany.id, name: RateEnum.Hourly},
  {id: 96, tenantId: lhhGermany.id, name: RateEnum.Daily},
  {id: 97, tenantId: lhhGermany.id, name: RateEnum.Weekly},
  {id: 98, tenantId: lhhGermany.id, name: RateEnum.Monthly},
  {id: 99, tenantId: lhhGermany.id, name: RateEnum.Yearly},

  {id: 100, tenantId: focore.id, name: RateEnum.Yearly},

  //LHHSwi
  {id: 101, tenantId: lhhSwi.id, name: RateEnum.Hourly},
  {id: 102, tenantId: lhhSwi.id, name: RateEnum.Daily},
  {id: 103, tenantId: lhhSwi.id, name: RateEnum.Weekly},
  {id: 104, tenantId: lhhSwi.id, name: RateEnum.Monthly},
  {id: 105, tenantId: lhhSwi.id, name: RateEnum.Yearly},
];
