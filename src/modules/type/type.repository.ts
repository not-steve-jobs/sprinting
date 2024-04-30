import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Type} from './type.entity';

@EntityRepository(Type)
export class TypeRepository extends AbstractRepository<Type> {
  private q(tenantId: number): SelectQueryBuilder<Type> {
    return this.createQueryBuilder('Type').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findAll(): Promise<Type[]> {
    return this.manager.find(Type);
  }

  public async findOneByName(tenantId: number, name: string, entityName: string): Promise<Type> {
    return this.manager.findOne(Type, {where: {tenantId, name, entityName}});
  }

  public async getAll(tenantId: number): Promise<Type[]> {
    return this.q(tenantId).getMany();
  }

  public async save(entity: Type) {
    return this.manager.save(entity);
  }
}
