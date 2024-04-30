import {Injectable} from '@nestjs/common';
import {RoleService} from '../role/role.service';
import {ClientConfigurationRepository} from './clientConfiguration.repository';
import {FeatureConfigurationService} from '../featureConfiguration/featureConfiguration.service';
import {SharedErrors} from 'src/core/error/shared.error';
import {FeatureConfigurationFeature} from '../featureConfiguration/enum/featureConfigurationFeature.enum';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {FeatureConfigurationChannel} from '../featureConfiguration/enum/featureConfigurationChannel.enum';

@Injectable()
export class ClientConfigurationService {
  constructor(
    private readonly repo: ClientConfigurationRepository,
    private readonly roleService: RoleService,
    private readonly featureConfigurationService: FeatureConfigurationService,
    private readonly appConfig: AppConfigService,
  ) {}

  public async getMainMenu(tenantId: number, clientId: string, userRoleId: number) {
    const conf = await this.repo.getMainMenu(tenantId, clientId, userRoleId);
    if (!conf) {
      throw new SharedErrors.EntityNotFoundError({
        id: JSON.stringify({
          tenantId,
          channel: FeatureConfigurationChannel.CLA,
          feature: FeatureConfigurationFeature.MainMenu,
          userRoleId,
        }),
        name: 'FeatureConfiguration',
      });
    }
    const menuConfig = conf.menuConfig;

    const finalMenu =
      menuConfig.disabledMenus && menuConfig.disabledMenus.length > 0
        ? menuConfig.menuItems.filter((menuItem) => !(menuConfig.disabledMenus || []).includes(menuItem.name))
        : menuConfig.menuItems;

    // Replace hostNames with actual URLs
    return finalMenu.map((menuItem) => {
      if (!menuItem.hostName) {
        return menuItem;
      }

      const host = this.appConfig.hostNameUrls.find((x) => x.hostName === menuItem.hostName);

      if (!host) {
        return menuItem;
      }

      return {...menuItem, fullLink: `${host.url}${menuItem.link}`};
    });
  }

  public async getConfig(
    tenantId: number,
    channel: string,
    feature: FeatureConfigurationFeature,
    roleId: number,
    clientId: string,
  ): Promise<any> {
    const commonRole = await this.roleService.getRoleByName('common');
    const commonRoleId = commonRole?.id;

    const [featureConfig, commonClientConfig, roleClientConfig] = await Promise.all([
      this.featureConfigurationService.getFeatureConfigurationByFeatureName(tenantId, feature),
      this.repo.findOne(tenantId, feature, channel, commonRoleId, clientId),
      roleId !== commonRoleId ? this.repo.findOne(tenantId, feature, channel, roleId, clientId) : null,
    ]);

    if (!featureConfig) {
      throw new SharedErrors.EntityNotFoundError({
        id: JSON.stringify({tenantId, channel, feature, roleId}),
        name: 'FeatureConfiguration',
      });
    }

    const clientConfig = Object.assign({}, featureConfig.config, commonClientConfig?.config, roleClientConfig?.config);

    return clientConfig;
  }
}
