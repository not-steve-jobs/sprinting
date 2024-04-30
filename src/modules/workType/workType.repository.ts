import {WorkType} from './workType.entity';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';

@EntityRepository(WorkType)
export class WorkTypeRepository extends AbstractRepository<WorkType> {
  private q(tenantId: number): SelectQueryBuilder<WorkType> {
    return this.createQueryBuilder('WorkType').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findAll(): Promise<WorkType[]> {
    return this.manager.find(WorkType);
  }

  public async findOne(id: number, tenantId: number): Promise<WorkType> {
    return this.manager.findOne(WorkType, {where: {id, tenantId}});
  }

  public async save(entity: WorkType) {
    return this.manager.save(entity);
  }

  public async getAll(tenantId: number): Promise<WorkType[]> {
    return this.q(tenantId).orderBy('id', 'ASC').getMany();
  }
}
