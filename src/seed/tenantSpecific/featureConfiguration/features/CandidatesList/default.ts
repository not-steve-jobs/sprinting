import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {candidatesListAvailableFilters} from './data/availableFilters/availableFilters.data';
import {experienceLevelOptions} from './data/availableFilters/experienceLevelOptions.data';
import {CandidatesListFeatureConfiguration} from './interface';

export const defaultCandidatesListFeatureConfiguration: CandidatesListFeatureConfiguration = {
  availableFilters: [
    {
      ...candidatesListAvailableFilters.experienceLevel,
      options: [
        experienceLevelOptions.underOneYear,
        experienceLevelOptions.betweenOneAndTwoYears,
        experienceLevelOptions.betweenTwoAndFiveYears,
        experienceLevelOptions.betweenFiveAndTenYears,
        experienceLevelOptions.betweenTenAndTwentyYears,
        experienceLevelOptions.overTwentyYears,
      ],
    },
    candidatesListAvailableFilters.language,
    candidatesListAvailableFilters.location,
    candidatesListAvailableFilters.levelOfEducation,
  ],
};

/**
 * Get the default feature configuration for the Candidates List feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Candidates List feature
 */
export const getDefaultCandidatesListFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.CandidatesList,
  config: defaultCandidatesListFeatureConfiguration,
});
