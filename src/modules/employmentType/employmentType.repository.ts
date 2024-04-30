import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {EmploymentType} from './employmentType.entity';

@EntityRepository(EmploymentType)
export class EmploymentTypeRepository extends AbstractRepository<EmploymentType> {
  private q(tenantId: number): SelectQueryBuilder<EmploymentType> {
    return this.createQueryBuilder('EmploymentType').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findOneByName(name: string, tenantId: number): Promise<EmploymentType> {
    return this.manager.findOne(EmploymentType, {
      where: {name, tenantId},
    });
  }

  public async findOneByEmploymentTypeId(id: number, tenantId: number): Promise<EmploymentType> {
    return this.manager.findOne(EmploymentType, {
      where: {id, tenantId},
    });
  }

  public async findAll(): Promise<EmploymentType[]> {
    return this.manager.find(EmploymentType);
  }

  public async save(entity: EmploymentType) {
    return this.manager.save(entity);
  }

  public async getTenantEmploymentTypes(tenantId: number): Promise<EmploymentType[]> {
    return this.q(tenantId).select(['EmploymentType.name', 'EmploymentType.id']).orderBy('id', 'ASC').getMany();
  }
}
