import {FeatureConfigFilter} from 'src/modules/featureConfiguration/featureConfiguration.interface';

/**
 * Feature to control the Candidates List on the Staffing Requests - Order Details page
 *
 * @param {FeatureConfigFilter} availableFilters - Configure the list with the available filters
 */
export interface CandidatesListFeatureConfiguration {
  availableFilters: FeatureConfigFilter[];
}
