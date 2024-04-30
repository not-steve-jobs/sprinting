import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {CommunicationsFeatureConfiguration} from './interface';
import {communicationsWebKeys} from './data/webKeys.data';
import {communicationsCardKeys} from './data/cardKeys.data';
import {communicationsAvailableFilters} from './data/availableFilters.data';

export const defaultCommunicationsFeatureConfiguration: CommunicationsFeatureConfiguration = {
  webKeys: [
    communicationsWebKeys.subject,
    communicationsWebKeys.status,
    communicationsWebKeys.location,
    communicationsWebKeys.nameAndImage,
    communicationsWebKeys.caseCategory,
  ],
  cardKeys: [
    communicationsCardKeys.id,
    communicationsCardKeys.caseCategory,
    communicationsCardKeys.createdAt,
    communicationsCardKeys.location,
  ],
  availableFilters: [
    communicationsAvailableFilters.createdBy,
    communicationsAvailableFilters.category,
    communicationsAvailableFilters.status,
    communicationsAvailableFilters.location,
    communicationsAvailableFilters.creationDateFrom,
    communicationsAvailableFilters.creationDateTo,
  ],
};

/**
 * Get the default feature configuration for the Communications feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Communications feature
 */
export const getDefaultCommunicationsFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.Communications,
  config: defaultCommunicationsFeatureConfiguration,
});
