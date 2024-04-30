import {featureConfigurationDataTenantAdeccoLux} from './featureConfigurationDataTenantAdeccoLux';
import {featureConfigurationDataTenantAdeccoPol} from './featureConfigurationDataTenantAdeccoPol';
import {featureConfigurationDataTenantAdeccoSwi} from './featureConfigurationDataTenantAdeccoSwi';
import {featureConfigurationDataTenantAdeccoFoCore} from './featureConfigurationDataTenantFoCore';
import {featureConfigurationDataTenantAdeccoUsa} from './featureConfigurationDataTenantAdeccoUsa';
import {featureConfigurationDataTenantlhhSwi} from './featureConfigurationDataTenantAdeccoLhhSwi';
import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.interface';

export const featureConfigurationData: FeatureConfiguration[] = [
  ...featureConfigurationDataTenantAdeccoLux,
  ...featureConfigurationDataTenantAdeccoPol,
  ...featureConfigurationDataTenantAdeccoSwi,
  ...featureConfigurationDataTenantAdeccoFoCore,
  ...featureConfigurationDataTenantAdeccoUsa,
  ...featureConfigurationDataTenantlhhSwi,
];

export const featureConfigurationsByTenant = {};
featureConfigurationData.forEach((fc) => {
  const tenantId = fc.tenantId;
  if (!featureConfigurationsByTenant[tenantId]) {
    featureConfigurationsByTenant[tenantId] = [];
  }
  featureConfigurationsByTenant[tenantId].push(fc);
});
