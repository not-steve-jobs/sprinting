import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {AvailableWorkers} from './availableWorkers.entity';

@EntityRepository(AvailableWorkers)
export class AvailableWorkersRepository extends AbstractRepository<AvailableWorkers> {
  private q(tenantId: number): SelectQueryBuilder<AvailableWorkers> {
    return this.createQueryBuilder('AvailableWorkers').where('"AvailableWorkers"."tenantId" = :tenantId', {tenantId});
  }

  public async findOne(tenantId: number, jobRoleId: string): Promise<AvailableWorkers> {
    return this.q(tenantId).andWhere('"jobRoleId" = :jobRoleId', {jobRoleId}).getOne();
  }

  public async findAll(tenantId: number): Promise<AvailableWorkers[]> {
    return this.q(tenantId).getMany();
  }

  public async save(entity: AvailableWorkers) {
    return this.manager.save(entity);
  }

  public async fetchAvailableWorkersForRole(tenantId: number, jobRoleId: string): Promise<AvailableWorkers> {
    const query = this.q(tenantId).andWhere('"jobRoleId" = :jobRoleId', {jobRoleId});
    return query.getOne();
  }

  public async deleteWorkersForRoles(tenantId: number, jobRoleIds: string[]) {
    return jobRoleIds.length
      ? this.q(tenantId).andWhere('jobRoleId IN (:...jobRoleIds)', {jobRoleIds}).delete().execute()
      : '';
  }

  public async deleteMany(entity: AvailableWorkers[]) {
    return this.manager.remove(entity);
  }
}
