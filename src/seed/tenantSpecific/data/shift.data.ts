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

// NOTE: please add new records at the end of the file and don't change existing IDs
export const shiftData: PlainObject[] = [
  {id: 1, tenantId: adeccoPol.id, name: 'Morning'},
  {id: 2, tenantId: adeccoPol.id, name: 'Afternoon'},
  {id: 3, tenantId: adeccoPol.id, name: 'Night'},

  {id: 4, tenantId: adeccoLux.id, name: 'Afternoon'},
  {id: 5, tenantId: adeccoLux.id, name: 'Evening'},
  {id: 6, tenantId: adeccoLux.id, name: 'Morning'},
  {id: 7, tenantId: adeccoLux.id, name: 'Night'},
  {id: 8, tenantId: adeccoLux.id, name: '2x8'},
  {id: 9, tenantId: adeccoLux.id, name: '3x8'},
  {id: 10, tenantId: adeccoLux.id, name: '4x8'},
  {id: 11, tenantId: adeccoLux.id, name: 'Day'},
  {id: 12, tenantId: adeccoLux.id, name: 'Friday & weekend'},
  {id: 13, tenantId: adeccoLux.id, name: 'Weekend'},
  {id: 14, tenantId: adeccoLux.id, name: 'Cut-off'},

  {id: 15, tenantId: adiaLux.id, name: 'Morning'},
  {id: 16, tenantId: adiaLux.id, name: 'Afternoon'},
  {id: 17, tenantId: adiaLux.id, name: 'Night'},

  {id: 18, tenantId: adeccoPol.id, name: 'I shift'},
  {id: 19, tenantId: adeccoPol.id, name: 'II shift'},
  {id: 20, tenantId: adeccoPol.id, name: 'III shift'},
  {id: 21, tenantId: adeccoPol.id, name: 'Continuos / IV shifts'},
  {id: 22, tenantId: adeccoPol.id, name: 'Working time 12h'},
  {id: 23, tenantId: adeccoPol.id, name: 'Weekends (fri, sat, sun)'},

  // adeccoSwi
  {id: 24, tenantId: adeccoSwi.id, name: 'Morning'},
  {id: 25, tenantId: adeccoSwi.id, name: 'Afternoon'},
  {id: 26, tenantId: adeccoSwi.id, name: 'Night'},
  {id: 27, tenantId: adeccoSwi.id, name: 'Rotating'},
  {id: 28, tenantId: adeccoSwi.id, name: 'All Day'},
  {id: 29, tenantId: adeccoSwi.id, name: 'Weekend'},

  // genericSwi
  {id: 30, tenantId: genericSwi.id, name: 'Morning'},
  {id: 31, tenantId: genericSwi.id, name: 'Afternoon'},
  {id: 32, tenantId: genericSwi.id, name: 'Night'},
  {id: 33, tenantId: genericSwi.id, name: 'Rotating'},
  {id: 34, tenantId: genericSwi.id, name: 'All Day'},
  {id: 35, tenantId: genericSwi.id, name: 'Weekend'},

  // adeccoGroupSwi
  {id: 36, tenantId: adeccoGroupSwi.id, name: 'Morning'},
  {id: 37, tenantId: adeccoGroupSwi.id, name: 'Afternoon'},
  {id: 38, tenantId: adeccoGroupSwi.id, name: 'Night'},
  {id: 39, tenantId: adeccoGroupSwi.id, name: 'Rotating'},
  {id: 40, tenantId: adeccoGroupSwi.id, name: 'All Day'},
  {id: 41, tenantId: adeccoGroupSwi.id, name: 'Weekend'},

  // badenochAndClarkSwi
  {id: 42, tenantId: badenochAndClarkSwi.id, name: 'Morning'},
  {id: 43, tenantId: badenochAndClarkSwi.id, name: 'Afternoon'},
  {id: 44, tenantId: badenochAndClarkSwi.id, name: 'Night'},
  {id: 45, tenantId: badenochAndClarkSwi.id, name: 'Rotating'},
  {id: 46, tenantId: badenochAndClarkSwi.id, name: 'All Day'},
  {id: 47, tenantId: badenochAndClarkSwi.id, name: 'Weekend'},

  // pontoonSwi
  {id: 48, tenantId: pontoonSwi.id, name: 'Morning'},
  {id: 49, tenantId: pontoonSwi.id, name: 'Afternoon'},
  {id: 50, tenantId: pontoonSwi.id, name: 'Night'},
  {id: 51, tenantId: pontoonSwi.id, name: 'Rotating'},
  {id: 52, tenantId: pontoonSwi.id, name: 'All Day'},
  {id: 53, tenantId: pontoonSwi.id, name: 'Weekend'},

  // springProSwi
  {id: 54, tenantId: springProSwi.id, name: 'Morning'},
  {id: 55, tenantId: springProSwi.id, name: 'Afternoon'},
  {id: 56, tenantId: springProSwi.id, name: 'Night'},
  {id: 57, tenantId: springProSwi.id, name: 'Rotating'},
  {id: 58, tenantId: springProSwi.id, name: 'All Day'},
  {id: 59, tenantId: springProSwi.id, name: 'Weekend'},

  // foCore
  {id: 60, tenantId: focore.id, name: 'Afternoon'},
  {id: 61, tenantId: focore.id, name: 'Morning'},
  {id: 62, tenantId: focore.id, name: 'Night'},
  {id: 63, tenantId: focore.id, name: 'I shift'},
  {id: 64, tenantId: focore.id, name: 'III shift'},
  {id: 65, tenantId: focore.id, name: 'II shift'},
  {id: 66, tenantId: focore.id, name: 'Weekends (fri, sat, sun)'},
  {id: 67, tenantId: focore.id, name: 'Working time 12h'},
  {id: 68, tenantId: focore.id, name: 'Continuos / IV shifts'},

  // adeccoUsa
  {id: 69, tenantId: adeccoUsa.id, name: 'Morning'},
  {id: 70, tenantId: adeccoUsa.id, name: 'Afternoon'},
  {id: 71, tenantId: adeccoUsa.id, name: 'Night'},
  {id: 72, tenantId: adeccoUsa.id, name: 'Rotating'},
  {id: 73, tenantId: adeccoUsa.id, name: 'All Day'},
  {id: 74, tenantId: adeccoUsa.id, name: 'Weekend'},

  //DAIGermany
  {id: 75, tenantId: daiGermany.id, name: 'Morning'},
  {id: 76, tenantId: daiGermany.id, name: 'Afternoon'},
  {id: 77, tenantId: daiGermany.id, name: 'Night'},
  {id: 78, tenantId: daiGermany.id, name: 'Rotating'},
  {id: 79, tenantId: daiGermany.id, name: 'All Day'},
  {id: 80, tenantId: daiGermany.id, name: 'Weekend'},

  //MPGermany
  {id: 81, tenantId: mpGermany.id, name: 'Morning'},
  {id: 82, tenantId: mpGermany.id, name: 'Afternoon'},
  {id: 83, tenantId: mpGermany.id, name: 'Night'},
  {id: 84, tenantId: mpGermany.id, name: 'Rotating'},
  {id: 85, tenantId: mpGermany.id, name: 'All Day'},
  {id: 86, tenantId: mpGermany.id, name: 'Weekend'},

  //adeccoGermany
  {id: 87, tenantId: adeccoGermany.id, name: 'Morning'},
  {id: 88, tenantId: adeccoGermany.id, name: 'Afternoon'},
  {id: 89, tenantId: adeccoGermany.id, name: 'Night'},
  {id: 90, tenantId: adeccoGermany.id, name: 'Rotating'},
  {id: 91, tenantId: adeccoGermany.id, name: 'All Day'},
  {id: 92, tenantId: adeccoGermany.id, name: 'Weekend'},

  //ModisGermany
  {id: 93, tenantId: modisGermany.id, name: 'Morning'},
  {id: 94, tenantId: modisGermany.id, name: 'Afternoon'},
  {id: 95, tenantId: modisGermany.id, name: 'Night'},
  {id: 96, tenantId: modisGermany.id, name: 'Rotating'},
  {id: 97, tenantId: modisGermany.id, name: 'All Day'},
  {id: 98, tenantId: modisGermany.id, name: 'Weekend'},

  //DISAGGermany
  {id: 99, tenantId: disAgGermany.id, name: 'Morning'},
  {id: 100, tenantId: disAgGermany.id, name: 'Afternoon'},
  {id: 101, tenantId: disAgGermany.id, name: 'Night'},
  {id: 102, tenantId: disAgGermany.id, name: 'Rotating'},
  {id: 103, tenantId: disAgGermany.id, name: 'All Day'},
  {id: 104, tenantId: disAgGermany.id, name: 'Weekend'},

  //badenochAndClarkGermany
  {id: 105, tenantId: badenochAndClarkGermany.id, name: 'Morning'},
  {id: 106, tenantId: badenochAndClarkGermany.id, name: 'Afternoon'},
  {id: 107, tenantId: badenochAndClarkGermany.id, name: 'Night'},
  {id: 108, tenantId: badenochAndClarkGermany.id, name: 'Rotating'},
  {id: 109, tenantId: badenochAndClarkGermany.id, name: 'All Day'},
  {id: 110, tenantId: badenochAndClarkGermany.id, name: 'Weekend'},

  //pontoonGermany
  {id: 111, tenantId: pontoonGermany.id, name: 'Morning'},
  {id: 112, tenantId: pontoonGermany.id, name: 'Afternoon'},
  {id: 113, tenantId: pontoonGermany.id, name: 'Night'},
  {id: 114, tenantId: pontoonGermany.id, name: 'Rotating'},
  {id: 115, tenantId: pontoonGermany.id, name: 'All Day'},
  {id: 116, tenantId: pontoonGermany.id, name: 'Weekend'},

  //springProGermany
  {id: 117, tenantId: springProGermany.id, name: 'Morning'},
  {id: 118, tenantId: springProGermany.id, name: 'Afternoon'},
  {id: 119, tenantId: springProGermany.id, name: 'Night'},
  {id: 120, tenantId: springProGermany.id, name: 'Rotating'},
  {id: 121, tenantId: springProGermany.id, name: 'All Day'},
  {id: 122, tenantId: springProGermany.id, name: 'Weekend'},

  //LHHGermany
  {id: 123, tenantId: lhhGermany.id, name: 'Morning'},
  {id: 124, tenantId: lhhGermany.id, name: 'Afternoon'},
  {id: 125, tenantId: lhhGermany.id, name: 'Night'},
  {id: 126, tenantId: lhhGermany.id, name: 'Rotating'},
  {id: 127, tenantId: lhhGermany.id, name: 'All Day'},
  {id: 128, tenantId: lhhGermany.id, name: 'Weekend'},

  // LHHSwi
  {id: 129, tenantId: lhhSwi.id, name: 'Morning'},
  {id: 130, tenantId: lhhSwi.id, name: 'Afternoon'},
  {id: 131, tenantId: lhhSwi.id, name: 'Night'},
  {id: 132, tenantId: lhhSwi.id, name: 'Rotating'},
  {id: 133, tenantId: lhhSwi.id, name: 'All Day'},
  {id: 134, tenantId: lhhSwi.id, name: 'Weekend'},
];
