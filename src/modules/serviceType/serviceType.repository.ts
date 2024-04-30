import {ServiceTypeListDto} from './dto/serviceTypeList.dto';
import {AbstractRepository, EntityRepository, In, SelectQueryBuilder} from 'typeorm';
import {ServiceType} from './serviceType.entity';

@EntityRepository(ServiceType)
export class ServiceTypeRepository extends AbstractRepository<ServiceType> {
  private q(tenantId: number): SelectQueryBuilder<ServiceType> {
    return this.createQueryBuilder('ServiceType').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findOne(id: number, tenantId: number): Promise<ServiceType> {
    return this.manager.findOne(ServiceType, {where: {id, tenantId}});
  }

  /**
   * Returns all rows from database as a Promise.
   *
   * @returns {Promise<ServiceType[]>} - Promise, retrieving the data rows from the database
   */
  public async findAll(): Promise<ServiceType[]> {
    return this.manager.find(ServiceType);
  }

  public async save(entity: ServiceType) {
    return this.manager.save(entity);
  }

  public async getAll(tenantId: number): Promise<ServiceTypeListDto[]> {
    return this.q(tenantId)
      .select(['ServiceType.name', 'ServiceType.id', 'ServiceType.keyName'])
      .orderBy('id', 'ASC')
      .getMany();
  }

  public async findById(tenantId: number, ids: number[]): Promise<ServiceType[]> {
    if (ids.length === 0) return;

    return this.manager.find(ServiceType, {
      where: {tenantId, id: In(ids)},
    });
  }
}
