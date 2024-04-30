import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {JobRoleTemplateFeatureConfiguration} from './interface';

export const defaultJobRoleTemplateFeatureConfiguration: JobRoleTemplateFeatureConfiguration = {
  source: 'storage',
  baseUrl: null,
};

/**
 * Get the default feature configuration for the JobDescription feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the JobDescription feature
 */
export const getDefaultJobRoleTemplateFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.JobRoleTemplate,
  config: defaultJobRoleTemplateFeatureConfiguration,
});
