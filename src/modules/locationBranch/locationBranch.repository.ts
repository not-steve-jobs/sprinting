import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {LocationBranch} from './locationBranch.entity';

@EntityRepository(LocationBranch)
export class LocationBranchRepository extends AbstractRepository<LocationBranch> {
  private q(tenantId: number): SelectQueryBuilder<LocationBranch> {
    return this.createQueryBuilder('LocationBranch').where('"LocationBranch"."tenantId" = :tenantId', {tenantId});
  }

  public async getBranches(tenantId: number, clientId: string, inTerritory: boolean = true): Promise<LocationBranch[]> {
    return this.q(tenantId)
      .leftJoinAndSelect('LocationBranch.location', 'Location')
      .leftJoinAndSelect('LocationBranch.branch', 'Branch')
      .andWhere('"Location"."clientId" = :clientId', {clientId})
      .andWhere('"LocationBranch"."inTerritory" = :inTerritory', {inTerritory})
      .getMany();
  }

  public async save(entity: LocationBranch) {
    return this.manager.save(entity);
  }

  public async findOne(tenantId: number, locationId: string, branchId: string): Promise<LocationBranch> {
    return this.q(tenantId)
      .andWhere('"LocationBranch"."locationId" = :locationId', {locationId})
      .andWhere('"LocationBranch"."branchId" = :branchId', {branchId})
      .getOne();
  }
}
