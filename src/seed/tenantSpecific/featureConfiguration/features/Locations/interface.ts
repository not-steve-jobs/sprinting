import {LocationStatusEnum} from 'src/modules/location/location.enum';

/**
 * Feature to control the Locations module
 *
 * @param {LocationStatusEnum} status - Toggle the statue of the Locations module
 */
export interface LocationFeatureConfiguration {
  status: LocationStatusEnum;
}
