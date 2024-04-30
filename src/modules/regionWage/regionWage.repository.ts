import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {RegionWage} from './regionWage.entity';

@EntityRepository(RegionWage)
export class RegionWageRepository extends AbstractRepository<RegionWage> {
  private q(tenantId: number): SelectQueryBuilder<RegionWage> {
    return this.createQueryBuilder('RegionWage').where('"RegionWage"."tenantId" = :tenantId', {tenantId});
  }

  public async findOne(tenantId: number, id: string): Promise<RegionWage> {
    return this.q(tenantId).andWhere('"id" = :id', {id}).getOne();
  }

  public async findAll(tenantId: number): Promise<RegionWage[]> {
    return this.q(tenantId).getMany();
  }

  public async save(entity: RegionWage) {
    return this.manager.save(entity);
  }

  public async fetchWagesForRegion(tenantId: number, regionId: string): Promise<RegionWage[]> {
    const query = this.q(tenantId).andWhere('"regionId" = :regionId', {regionId}).orderBy('minimum', 'ASC');
    return query.getMany();
  }

  public async findWageForRegionAndJobRole(
    tenantId: number,
    jobRoleId: string,
    regionId: string,
  ): Promise<RegionWage[]> {
    const query = this.q(tenantId)
      .andWhere('"jobRoleId" = :jobRoleId', {jobRoleId})
      .andWhere('"regionId" = :regionId', {regionId})
      .orderBy('minimum', 'ASC');
    return query.getMany();
  }

  public async findWageForRegionJobRoleAndLevel(
    tenantId: number,
    regionId: string,
    jobRoleId: string,
    experienceLevelId: string,
  ): Promise<RegionWage> {
    const query = this.q(tenantId)
      .andWhere('"regionId" = :regionId', {regionId})
      .andWhere('"jobRoleId" = :jobRoleId', {jobRoleId})
      .andWhere('"experienceLevelId" = :experienceLevelId', {experienceLevelId});
    return query.getOne();
  }

  public async deleteWageForRoles(tenantId: number, jobRoleIds: string[]) {
    return jobRoleIds.length
      ? this.q(tenantId).andWhere('jobRoleId IN (:...jobRoleIds)', {jobRoleIds}).delete().execute()
      : '';
  }

  public async deleteWageForRegions(regionIds: string[]) {
    return regionIds.length
      ? this.createQueryBuilder('RegionWage').andWhere('region.id IN (:...regionIds)', {regionIds}).delete().execute()
      : '';
  }
}
