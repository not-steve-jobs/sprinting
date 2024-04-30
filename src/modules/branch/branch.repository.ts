import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Branch} from './branch.entity';

@EntityRepository(Branch)
export class BranchRepository extends AbstractRepository<Branch> {
  private q(tenantId: number): SelectQueryBuilder<Branch> {
    return this.createQueryBuilder('Branch').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findOneByBranchId(id: string, tenantId: number): Promise<Branch> {
    return this.manager.findOne(Branch, {where: {id, tenantId}});
  }

  public async save(entity: Branch) {
    return this.manager.save(entity);
  }

  public async getTenantBranches(tenantId: number): Promise<any> {
    return this.q(tenantId).select(['Branch.name', 'Branch.id', 'Branch.status']).orderBy('id', 'ASC').getMany();
  }
}
