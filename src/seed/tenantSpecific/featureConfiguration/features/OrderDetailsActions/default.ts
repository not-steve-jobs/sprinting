import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {OrderDetailsJobOrderAction} from './enum/orderDetailsAction.enum';
import {JobOrderStatus} from 'src/modules/status/status.enum';
import {OrderDetailsActionsFeatureConfiguration, OrderDetailsActionSortOrder} from './interface';

export const defaultOrderDetailsActionsFeatureConfiguration: OrderDetailsActionsFeatureConfiguration = {
  actions: [
    {
      actionName: OrderDetailsJobOrderAction.CancelOrderByClient,
      displayInStatus: [JobOrderStatus.Submitted],
      sortOrderByPage: {
        [OrderDetailsActionSortOrder.ListingPage]: 1,
        [OrderDetailsActionSortOrder.OrderDetailsPageWeb]: 0,
        [OrderDetailsActionSortOrder.OrderDetailsPageMobile]: 1,
      },
    },
    {
      actionName: OrderDetailsJobOrderAction.EditOrder,
      displayInStatus: [
        JobOrderStatus.Submitted,
        JobOrderStatus.InProgress,
        JobOrderStatus.CandidatesPreselection,
        JobOrderStatus.PartiallyCovered,
        JobOrderStatus.Covered,
      ],
      sortOrderByPage: {
        [OrderDetailsActionSortOrder.ListingPage]: 0,
        [OrderDetailsActionSortOrder.OrderDetailsPageWeb]: 1,
        [OrderDetailsActionSortOrder.OrderDetailsPageMobile]: 0,
      },
    },
  ],
  cancelDetails: [
    {
      cancelType: JobOrderStatus.CanceledByTheClient,
      displayInStatus: [JobOrderStatus.CanceledByTheClient],
      hasCancelDetails: true,
    },
    {
      cancelType: JobOrderStatus.CancelledByAdecco,
      displayInStatus: [JobOrderStatus.CancelledByAdecco],
      hasCancelDetails: false,
    },
  ],
};

/**
 * Get the default feature configuration for the Order Details Actions feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Invitation feature
 */
export const getDefaultOrderDetailsActionsFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.OrderDetailsActions,
  config: defaultOrderDetailsActionsFeatureConfiguration,
});
