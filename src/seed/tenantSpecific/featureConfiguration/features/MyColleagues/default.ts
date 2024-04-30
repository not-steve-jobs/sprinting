import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {myColleaguesAvailableFilters} from './data/availableFilters.data';
import {myColleaguesCardKeys} from './data/cardKeys.data';
import {myColleaguesWebKeys} from './data/webKeys.data';
import {MyColleaguesFeatureConfiguration} from './interface';

export const defaultMyColleaguesFeatureConfiguration: MyColleaguesFeatureConfiguration = {
  webKeys: [
    myColleaguesWebKeys.nameAndImage,
    myColleaguesWebKeys.status,
    myColleaguesWebKeys.userType,
    myColleaguesWebKeys.worksite,
    myColleaguesWebKeys.permissions,
    myColleaguesWebKeys.department,
    myColleaguesWebKeys.functionKey,
    myColleaguesWebKeys.mainLocation,
  ],
  cardKeys: [
    myColleaguesCardKeys.title,
    myColleaguesCardKeys.userType,
    myColleaguesCardKeys.status,
    myColleaguesCardKeys.worksite,
    myColleaguesCardKeys.permissions,
    myColleaguesCardKeys.department,
    myColleaguesCardKeys.functionKey,
    myColleaguesCardKeys.mainLocation,
  ],
  availableFilters: [
    myColleaguesAvailableFilters.name,
    myColleaguesAvailableFilters.location,
    myColleaguesAvailableFilters.permission,
    myColleaguesAvailableFilters.status,
    myColleaguesAvailableFilters.department,
    myColleaguesAvailableFilters.functionFilter,
    myColleaguesAvailableFilters.userType,
  ],
};

/**
 * Get the default feature configuration for the My Colleagues feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the My Colleagues feature
 */
export const getDefaultMyColleaguesFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.MyColleagues,
  config: defaultMyColleaguesFeatureConfiguration,
});
