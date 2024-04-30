import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {mainMenuItems} from './data/menuItems.data';
import {MainMenuFeatureConfiguration} from './interface';

export const defaultMainMenuFeatureConfiguration: MainMenuFeatureConfiguration = {
  menuItems: [
    mainMenuItems.dashboard,
    mainMenuItems.orderManagement,
    mainMenuItems.contracts,
    mainMenuItems.invoices,
    mainMenuItems.communication,
  ],
};

/**
 * Get the default feature configuration for the Main Menu feature
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the Main Menu feature
 */
export const getDefaultMainMenuFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.MainMenu,
  roleId: 5,
  config: defaultMainMenuFeatureConfiguration,
});
