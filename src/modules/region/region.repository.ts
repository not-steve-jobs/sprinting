import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Region} from './region.entity';

@EntityRepository(Region)
export class RegionRepository extends AbstractRepository<Region> {
  private q(tenantId: number): SelectQueryBuilder<Region> {
    return this.createQueryBuilder('Region').where('"Region"."tenantId" = :tenantId', {tenantId});
  }

  public async findOne(id: string): Promise<Region> {
    return this.manager.findOne(Region, {
      where: {
        id,
      },
    });
  }

  public async findAll(tenantId: number): Promise<Region[]> {
    return this.q(tenantId).getMany();
  }

  public async save(entity: Region) {
    return this.manager.save(entity);
  }

  public async findDefaultRegion(tenantId: number): Promise<Region> {
    return this.q(tenantId).andWhere('"default" = true').orderBy('id', 'ASC').getOne();
  }

  public async findByName(tenantId: number, regionName: string) {
    return this.q(tenantId).andWhere('"name" = :regionName', {regionName}).getOne();
  }

  public async deleteMultiple(regionIds: string[]) {
    return regionIds.length
      ? this.createQueryBuilder('Region').andWhere('id IN (:...regionIds)', {regionIds}).delete().execute()
      : '';
  }
}
