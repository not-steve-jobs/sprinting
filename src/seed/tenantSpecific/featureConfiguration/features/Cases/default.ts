import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {CasesFeatureConfiguration} from './interface';

export const defaultCasesFeatureConfiguration: CasesFeatureConfiguration = {
  enableAllCases: true,
  requireFileDownloadConfirmation: [],
};

/**
 * Get the default feature configuration for the Cases feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Cases feature
 */
export const getDefaultCasesFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.Cases,
  config: defaultCasesFeatureConfiguration,
});
