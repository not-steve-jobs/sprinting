import {Injectable} from '@nestjs/common';
import {FeatureConfigurationDto} from './dto/featureConfiguration.dto';
import {FeatureConfigurationRepository} from './featureConfiguration.repository';
import {SharedErrors} from '../../core/error/shared.error';
import {FeatureConfigurationFeature} from './enum/featureConfigurationFeature.enum';
import {FeatureConfigurationCacheService} from 'src/appCache/featureConfigurationCache.service';
import {FeatureConfigurationIdentifier} from './featureConfiguration.interface';

@Injectable()
export class FeatureConfigurationService {
  constructor(
    private readonly featureConfigurationRepository: FeatureConfigurationRepository,
    private readonly cache: FeatureConfigurationCacheService,
  ) {}

  public async getFeatureConfigurationByFeatureName(tenantId: number, featureName: FeatureConfigurationFeature) {
    let result = this.cache.findOneByTenantAndFeature(tenantId, featureName);
    if (result) {
      return result;
    }

    result = await this.featureConfigurationRepository.findOneByFeature(tenantId, featureName);
    this.cache.setOneByTenantAndFeature(tenantId, featureName, result);
    return result;
  }

  public async getOne(tenantId: number, channel: string, feature: string): Promise<FeatureConfigurationDto> {
    let result = this.cache.findOneByTenantAndFeatureAndChannel(
      tenantId,
      feature as FeatureConfigurationFeature,
      channel,
    );
    if (result) {
      return result;
    }

    result = await this.featureConfigurationRepository.findOneForChannelAndFeature(tenantId, feature, channel);
    if (!result) {
      throw new SharedErrors.EntityNotFoundError({
        id: JSON.stringify({tenantId, feature, channel}),
        name: 'FeatureConfiguration',
      });
    }
    this.cache.setOneByTenantAndFeatureAndChannel(tenantId, feature as FeatureConfigurationFeature, channel, result);
    return result;
  }

  public async getMany(
    tenantId: number,
    identifiers: FeatureConfigurationIdentifier[] = [],
  ): Promise<FeatureConfigurationDto[]> {
    return Promise.all(
      identifiers.map((item) => {
        return this.getOne(tenantId, item.channel, item.feature);
      }),
    );
  }
}
