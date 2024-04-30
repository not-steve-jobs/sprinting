import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Status} from './status.entity';

@EntityRepository(Status)
export class StatusRepository extends AbstractRepository<Status> {
  private q(tenantId: number): SelectQueryBuilder<Status> {
    return this.createQueryBuilder('Status').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findAll(): Promise<Status[]> {
    return this.createQueryBuilder('Status').getMany();
  }

  public async findOne(tenantId: number, name: string, entityName: string): Promise<Status> {
    return this.manager.findOne(Status, {where: {tenantId, name, entityName}});
  }

  public async findOneById(tenantId: number, id: number, entityName: string): Promise<Status> {
    return this.manager.findOne(Status, {where: {tenantId, id, entityName}});
  }

  public async getAllByIds(tenantId: number, statusIds: number[]): Promise<Status[]> {
    return this.q(tenantId).andWhere('"id" = ANY (:statusIds)', {statusIds}).getMany();
  }

  public async getAll(tenantId: number): Promise<Status[]> {
    return this.q(tenantId).getMany();
  }

  public async findByEntityName(tenantId: number, entityName: string): Promise<Status[]> {
    return this.q(tenantId).andWhere('"entityName" = :entityName', {entityName}).getMany();
  }

  public async save(entity: Status) {
    return this.manager.save(entity);
  }
}
