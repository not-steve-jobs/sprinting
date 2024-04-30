import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {JobOrderAssociateStatus} from 'src/modules/status/status.enum';
import {OrderDetailsListingStatusesFeatureConfiguration} from './interface';

export const defaultOrderDetailsListingStatusesConfiguration: OrderDetailsListingStatusesFeatureConfiguration = {
  // candidates with those statuses will be displayed in 'Match' (first) tab of Order details -> Candidate list
  match: [JobOrderAssociateStatus.Submittal, JobOrderAssociateStatus.SendOut, JobOrderAssociateStatus.References],
  // candidates with those statuses will be displayed in 'Select' (second) tab of Order details -> Candidate list
  select: [
    JobOrderAssociateStatus.Offer,
    JobOrderAssociateStatus.AdminCheck,
    JobOrderAssociateStatus.PreContract,
    JobOrderAssociateStatus.ClosingReport,
  ],
  // candidates with those statuses will be counted as 'placed' e.g. '3/12 Filled position'
  placedCandidates: [JobOrderAssociateStatus.PreContract, JobOrderAssociateStatus.ClosingReport],
};

/**
 * Get the default feature configuration for the Order Details Listing Statuses feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Order Details Listing Statuses feature
 */
export const getDefaultOrderDetailsListingStatusesConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.OrderDetailsListingStatuses,
  config: defaultOrderDetailsListingStatusesConfiguration,
});
