import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {contractsAvailableFilters} from './data/availableFilters/availableFilters.data';
import {contractsCardKeys} from './data/cardKeys.data';
import {serviceTypeOptions} from './data/availableFilters/serviceTypeOptions.data';
import {contractsWebKeys} from './data/webKeys.data';
import {ContractsFeatureConfiguration} from './interface';
import {contractsFilterDateTypeOptions} from './data/availableFilters/dateTypeOptions.data';

export const defaultContractsFeatureConfiguration: ContractsFeatureConfiguration = {
  webKeys: [
    contractsWebKeys.number,
    contractsWebKeys.location,
    contractsWebKeys.associateName,
    contractsWebKeys.dateStart,
    contractsWebKeys.dateEnd,
    contractsWebKeys.status,
    contractsWebKeys.type,
    contractsWebKeys.service,
  ],
  cardKeys: [
    contractsCardKeys.location,
    contractsCardKeys.dateStart,
    contractsCardKeys.dateEnd,
    contractsCardKeys.type,
    contractsCardKeys.associateName,
    contractsCardKeys.service,
  ],
  availableFilters: [
    contractsAvailableFilters.location,
    {
      ...contractsAvailableFilters.dateType,
      options: [contractsFilterDateTypeOptions.dateStart, contractsFilterDateTypeOptions.dateEnd],
    },
    contractsAvailableFilters.periodFrom,
    contractsAvailableFilters.periodTo,
    contractsAvailableFilters.status,
    contractsAvailableFilters.contractType,
    {
      ...contractsAvailableFilters.serviceType,
      options: [
        serviceTypeOptions.delegation,
        serviceTypeOptions.payrolling,
        serviceTypeOptions.delegationEtudiant,
        serviceTypeOptions.payrollingEtudiant,
      ],
    },
    contractsAvailableFilters.associateName,
  ],
};

/**
 * Get the default feature configuration for the Contracts feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Contracts feature
 */
export const getDefaultContractsFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.Contracts,
  config: defaultContractsFeatureConfiguration,
});
