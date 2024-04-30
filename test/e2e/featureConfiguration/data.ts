import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.entity';
import {testTenant} from '../tenant/data';
import {getTestDate} from '../utils/helpers';

export const testFeatureConfiguration: Partial<FeatureConfiguration> = {
  id: '12345678-0000-4000-0000-000000000001',
  tenantId: testTenant.id,
  channel: FeatureConfigurationChannel.CLA,
  feature: FeatureConfigurationFeature.Invitation,
  config: {
    webKeys: [
      {
        key: 'number',
        type: 'string',
      },
    ],
  },
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
  isEnabled: true,
};

export const testFeatureConfigurationDisabled: Partial<FeatureConfiguration> = {
  id: '12345678-0000-4000-0000-000000000002',
  tenantId: testTenant.id,
  channel: FeatureConfigurationChannel.CLA,
  feature: FeatureConfigurationFeature.Cases,
  config: {
    webKeys: [
      {
        key: 'example',
        type: 'string',
      },
    ],
  },
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
  isEnabled: false,
};

export const testFeatureConfigurations: Partial<FeatureConfiguration>[] = [
  testFeatureConfiguration,
  testFeatureConfigurationDisabled,
];
