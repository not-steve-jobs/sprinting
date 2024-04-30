import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {staffingRequestsAvailableFilters} from './data/availableFilters/availableFilters.data';
import {staffingRequestsFilterDateTypeOptions} from './data/availableFilters/dateTypeOptions.data';
import {staffingRequestsCardKeys} from './data/cardKeys.data';
import {staffingRequestsWebKeys} from './data/webKeys.data';
import {StaffingRequestsFeatureConfiguration} from './interface';

export const defaultStaffingRequestsFeatureConfiguration: StaffingRequestsFeatureConfiguration = {
  webKeys: [
    staffingRequestsWebKeys.name,
    staffingRequestsWebKeys.status,
    staffingRequestsWebKeys.startAndEndDate,
    staffingRequestsWebKeys.location,
    staffingRequestsWebKeys.noOfPositions,
  ],
  cardKeys: [
    staffingRequestsCardKeys.name,
    staffingRequestsCardKeys.status,
    staffingRequestsCardKeys.startAndEndDate,
    staffingRequestsCardKeys.location,
    staffingRequestsCardKeys.noOfPositions,
    staffingRequestsCardKeys.role,
  ],
  availableFilters: [
    staffingRequestsAvailableFilters.orderStatus,
    staffingRequestsAvailableFilters.createdBy,
    {
      ...staffingRequestsAvailableFilters.dateType,
      options: [
        staffingRequestsFilterDateTypeOptions.submissionDate,
        staffingRequestsFilterDateTypeOptions.dateStart,
        staffingRequestsFilterDateTypeOptions.dateEnd,
      ],
    },
    staffingRequestsAvailableFilters.dateRangeFrom,
    staffingRequestsAvailableFilters.dateRangeTo,
    staffingRequestsAvailableFilters.serviceType,
    staffingRequestsAvailableFilters.location,
    staffingRequestsAvailableFilters.role,
  ],
};

/**
 * Get the default feature configuration for the Staffing Requests feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Staffing Requests feature
 */
export const getDefaultStaffingRequestsFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.StaffingRequests,
  config: defaultStaffingRequestsFeatureConfiguration,
});
