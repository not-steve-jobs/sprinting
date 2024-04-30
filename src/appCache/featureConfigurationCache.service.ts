import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {FeatureConfigurationDto} from 'src/modules/featureConfiguration/dto/featureConfiguration.dto';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.entity';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class FeatureConfigurationCacheService {
  private readonly name = CacheEntityName.featureConfiguration;
  private readonly isEnabled: boolean;

  constructor(private nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  findOneByTenantAndFeature = (
    tenantId: number,
    featureName: FeatureConfigurationFeature,
  ): FeatureConfiguration | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdAndFeatureNameKey(tenantId, featureName);
    return this.nodeCache.get<FeatureConfiguration>(key, this.name);
  };

  setOneByTenantAndFeature = (
    tenantId: number,
    featureName: FeatureConfigurationFeature,
    value: FeatureConfiguration,
  ): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdAndFeatureNameKey(tenantId, featureName);
    this.nodeCache.set(key, value, this.name);
  };

  findOneByTenantAndFeatureAndChannel = (
    tenantId: number,
    featureName: FeatureConfigurationFeature,
    channel: string,
  ) => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdAndFeatureNameAndChannelKey(tenantId, featureName, channel);
    return this.nodeCache.get<FeatureConfigurationDto>(key, this.name);
  };

  setOneByTenantAndFeatureAndChannel = (
    tenantId: number,
    featureName: FeatureConfigurationFeature,
    channel: string,
    value: FeatureConfigurationDto,
  ) => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdAndFeatureNameAndChannelKey(tenantId, featureName, channel);
    this.nodeCache.set<FeatureConfigurationDto>(key, value, this.name);
  };

  private tenantIdAndFeatureNameKey = (tenantId: number, featureName: FeatureConfigurationFeature) =>
    `${this.nodeCache.parseTenantIdKey(tenantId)}_featureName_${featureName}`;

  private tenantIdAndFeatureNameAndChannelKey = (
    tenantId: number,
    featureName: FeatureConfigurationFeature,
    channel: string,
  ) => `${this.tenantIdAndFeatureNameKey(tenantId, featureName)}_channel_${channel}`;
}
