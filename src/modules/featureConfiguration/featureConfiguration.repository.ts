import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {FeatureConfiguration} from './featureConfiguration.entity';
import {FeatureConfigurationFeature} from './enum/featureConfigurationFeature.enum';

@EntityRepository(FeatureConfiguration)
export class FeatureConfigurationRepository extends AbstractRepository<FeatureConfiguration> {
  private q(tenantId: number): SelectQueryBuilder<FeatureConfiguration> {
    return this.createQueryBuilder('FeatureConfiguration').where('"tenantId" = :tenantId', {tenantId});
  }
  public async findAll(tenantId: number): Promise<FeatureConfiguration[]> {
    return this.q(tenantId).getMany();
  }

  public async findOneByFeature(tenantId: number, feature: FeatureConfigurationFeature): Promise<FeatureConfiguration> {
    return this.q(tenantId).andWhere('"feature" = :feature', {feature}).getOne();
  }

  public async findOneForChannelAndFeature(
    tenantId: number,
    feature: string,
    channel: string,
  ): Promise<FeatureConfiguration> {
    return this.q(tenantId)
      .andWhere('"channel" = :channel', {channel})
      .andWhere('"feature" = :feature', {feature})
      .getOne();
  }

  public async save(entity: FeatureConfiguration) {
    return this.manager.save(entity);
  }
  public async delete(entity: FeatureConfiguration) {
    return this.manager.remove(entity);
  }
}
