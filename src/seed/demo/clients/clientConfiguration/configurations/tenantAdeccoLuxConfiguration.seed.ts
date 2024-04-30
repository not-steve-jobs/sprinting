import {
  ClientMenuLinkNameEnum,
  ClientMenuLinkTypeEnum,
  MenuItemHostNameEnum,
} from 'src/modules/clientConfiguration/dto/clientConfigurationMenuConfig.dto';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';

import {adeccoLux} from 'src/seed/tenantSpecific/data/tenant.data';

// TODO: To be refactored to comply with the new FeatureConfiguration interfaces
export const clientConfigurationDataTenantAdeccoLux: any[] = [
  {
    tenantId: adeccoLux.id,
    channel: FeatureConfigurationChannel.CLA,
    feature: FeatureConfigurationFeature.MainMenu,
    roleId: 5,
    config: {
      clientMenuItems: [
        {
          name: ClientMenuLinkNameEnum.ONSITE_PORTAL,
          link: '/client/job-orders',
          linkType: ClientMenuLinkTypeEnum.RELATIVE,
          iconName: 'CityNext2',
          hostName: MenuItemHostNameEnum.ONSITE,
        },
      ],
      disabledMenus: [],
    },
    isEnabled: true,
  },
];
