import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {RegionPostalCode} from './regionPostalCode.entity';

@EntityRepository(RegionPostalCode)
export class RegionPostalCodeRepository extends AbstractRepository<RegionPostalCode> {
  private q(regionId: string): SelectQueryBuilder<RegionPostalCode> {
    return this.createQueryBuilder('RegionPostalCode').where('"RegionPostalCode"."regionId" = :regionId', {regionId});
  }

  public async findOne(regionId: string, zip: string): Promise<RegionPostalCode> {
    return this.manager.findOne(RegionPostalCode, {
      where: {
        zip,
      },
    });
  }

  public async findAll(regionId: string): Promise<RegionPostalCode[]> {
    return this.q(regionId).getMany();
  }

  public async save(entity: RegionPostalCode) {
    return this.manager.save(entity);
  }
}
