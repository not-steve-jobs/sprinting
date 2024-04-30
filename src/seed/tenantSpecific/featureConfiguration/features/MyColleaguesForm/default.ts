import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';
import {MyColleagueFormFields} from './fields.data';
import {MyColleaguesFormFeatureConfiguration} from './interface';

const defaultMyColleaguesFormFeatureConfiguration: MyColleaguesFormFeatureConfiguration = {
  sections: [
    {
      title: 'personalInformation',
      rows: [
        {
          cells: [MyColleagueFormFields.email, MyColleagueFormFields.firstName],
        },
        {
          cells: [MyColleagueFormFields.lastName, MyColleagueFormFields.title],
        },
        {
          cells: [MyColleagueFormFields.department, MyColleagueFormFields.functionField],
        },
        {
          cells: [MyColleagueFormFields.mainLocation],
        },
        {
          cells: [MyColleagueFormFields.changeMainLocation],
        },
      ],
    },
    {
      title: 'permissions',
      rows: [
        {
          cells: [MyColleagueFormFields.permissionNote],
        },
        {
          cells: [MyColleagueFormFields.permissions],
        },
      ],
    },
    {
      title: 'locations',
      rows: [
        {
          cells: [MyColleagueFormFields.locationNote],
        },
        {
          cells: [MyColleagueFormFields.locationCounter],
        },
        {
          cells: [MyColleagueFormFields.locations],
        },
      ],
    },
  ],
};

/**
 * Get the default feature configuration for the My Colleagues add/edit form
 *
 * @param {number} tenantId - The ID of the Tenant for which the feature configuration belongs
 * @param {FeatureConfigurationChannel} channel - The channel of the feature configuration
 * @returns {FeatureConfiguration} - The default feature configuration for the My Colleagues add/edit form
 */
export const getDefaultMyColleaguesFormFeatureConfiguration = (
  tenantId: number,
  channel = FeatureConfigurationChannel.CLA,
): FeatureConfiguration => ({
  tenantId: tenantId,
  channel: channel,
  feature: FeatureConfigurationFeature.MyColleaguesForm,
  config: defaultMyColleaguesFormFeatureConfiguration,
});
