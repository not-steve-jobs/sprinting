import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {CreateJobOrderTypeFeatureConfiguration} from './interface';

export const defaultCreateJobOrderTypeConfiguration: CreateJobOrderTypeFeatureConfiguration = {
  availableTypes: [24, 25], // TODO: Add constants, or at least document those ids
  rateType: 47, // TODO: Add constants, or at least document those ids
};

/**
 * Get the default feature configuration for the Create Job Order Type feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Create Job Order Type feature
 */
export const getDefaultCreateJobOrderTypeConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.CreateJobOrderType,
  config: defaultCreateJobOrderTypeConfiguration,
});
