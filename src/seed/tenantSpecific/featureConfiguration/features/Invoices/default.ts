import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {invoicesAvailableFilters} from './data/availableFilters.data';
import {invoicesCardKeys} from './data/cardKeys.data';
import {invoicesWebKeys} from './data/webKeys.data';
import {InvoicesFeatureConfiguration} from './interface';

export const defaultInvoicesFeatureConfiguration: InvoicesFeatureConfiguration = {
  webKeys: [
    invoicesWebKeys.number,
    invoicesWebKeys.location,
    invoicesWebKeys.issueDate,
    invoicesWebKeys.totalAmount,
    invoicesWebKeys.status,
    invoicesWebKeys.duePaymentDate,
    invoicesWebKeys.overdue,
    invoicesWebKeys.periodStart,
    invoicesWebKeys.periodEnd,
    invoicesWebKeys.creditNotes,
  ],
  cardKeys: [
    invoicesCardKeys.number,
    invoicesCardKeys.hoursBilled,
    invoicesCardKeys.totalAmount,
    invoicesCardKeys.duePaymentDate,
    invoicesCardKeys.overdue,
    invoicesCardKeys.status,
  ],
  availableFilters: [
    invoicesAvailableFilters.location,
    invoicesAvailableFilters.status,
    {
      ...invoicesAvailableFilters.dateType,
      options: [{id: '1', label: 'duePaymentDate', name: 'duePaymentDate'}],
    },
    invoicesAvailableFilters.periodFrom,
    invoicesAvailableFilters.periodTo,
    invoicesAvailableFilters.creditNotes,
    invoicesAvailableFilters.overdue,
  ],
};

/**
 * Get the default feature configuration for the Invoices feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Invoices feature
 */
export const getDefaultInvoicesFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.Invoices,
  config: defaultInvoicesFeatureConfiguration,
});
