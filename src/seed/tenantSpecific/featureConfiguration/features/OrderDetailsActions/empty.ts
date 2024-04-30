import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {OrderDetailsActionsFeatureConfiguration} from './interface';

export const emptyOrderDetailsActionsFeatureConfiguration: OrderDetailsActionsFeatureConfiguration = {
  actions: [],
  cancelDetails: [],
};

/**
 * Get the default feature configuration for the Order Details Actions feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Invitation feature
 */
export const getEmptyOrderDetailsActionsFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.OrderDetailsActions,
  config: emptyOrderDetailsActionsFeatureConfiguration,
});
