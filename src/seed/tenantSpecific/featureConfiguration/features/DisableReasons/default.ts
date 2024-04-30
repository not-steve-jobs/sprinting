import {DisableReasonEnum} from 'src/modules/disableReason/disableReason.enum';
import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {DisableReasonsFeatureConfiguration} from './interface';

export const defaultDisableReasonsFeatureConfiguration: DisableReasonsFeatureConfiguration = {
  reasons: [DisableReasonEnum.NoLongerWorkInACompany, DisableReasonEnum.NewPosition, DisableReasonEnum.LongBreak],
};

/**
 * Get the default feature configuration for the Disable Reasons feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Disable Reasons feature
 */
export const getDefaultDisableReasonsFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.DisableReasons,
  config: defaultDisableReasonsFeatureConfiguration,
});
