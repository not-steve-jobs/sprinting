import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {JobOrderStatus} from 'src/modules/status/status.enum';
import {OrderDetailsTimelineFeatureConfiguration} from './interface';

export const defaultOrderDetailsTimelineConfiguration: OrderDetailsTimelineFeatureConfiguration = {
  stages: [
    {
      title: JobOrderStatus.Submitted,
      subtitle: 'submissionDate',
      type: 'extremity',
      tooltipText: JobOrderStatus.Submitted,
      statuses: [JobOrderStatus.Submitted],
    },
    {
      title: JobOrderStatus.InProgress,
      subtitle: 'submissionDate',
      type: 'extremity',
      tooltipText: JobOrderStatus.InProgress,
      statuses: [JobOrderStatus.InProgress],
    },
    {
      title: JobOrderStatus.CandidatesPreselection,
      subtitle: 'submissionDate',
      type: 'extremity',
      tooltipText: JobOrderStatus.CandidatesPreselection,
      statuses: [JobOrderStatus.CandidatesPreselection],
    },
    {
      title: JobOrderStatus.PartiallyCovered,
      subtitle: 'submissionDate',
      type: 'extremity',
      tooltipText: JobOrderStatus.PartiallyCovered,
      statuses: [JobOrderStatus.PartiallyCovered],
    },
    {
      title: JobOrderStatus.Covered,
      subtitle: 'submissionDate',
      type: 'extremity',
      tooltipText: JobOrderStatus.Covered,
      statuses: [JobOrderStatus.Covered],
    },
  ],
};

/**
 * Get the default feature configuration for the Order Details Timeline feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Order Details Timeline feature
 */
export const getDefaultOrderDetailsTimelineConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.OrderDetailsTimeline,
  config: defaultOrderDetailsTimelineConfiguration,
});
