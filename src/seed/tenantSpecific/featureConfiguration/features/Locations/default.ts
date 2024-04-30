import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {LocationStatusEnum} from 'src/modules/location/location.enum';
import {LocationFeatureConfiguration} from './interface';

export const defaultLocationFeatureConfiguration: LocationFeatureConfiguration = {
  status: LocationStatusEnum.Active,
};

/**
 * Get the default feature configuration for the Location feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Location feature
 */
export const getDefaultLocationFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.Locations,
  config: defaultLocationFeatureConfiguration,
});
