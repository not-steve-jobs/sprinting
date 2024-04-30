import {AbstractRepository, EntityRepository, SelectQueryBuilder, In} from 'typeorm';
import {Permission} from './permission.entity';

@EntityRepository(Permission)
export class PermissionRepository extends AbstractRepository<Permission> {
  private q(tenantId: number): SelectQueryBuilder<Permission> {
    return this.createQueryBuilder('Permission').where('Permission.tenantId = :tenantId', {tenantId});
  }

  public async findAll(): Promise<Permission[]> {
    return this.createQueryBuilder('Permission').getMany();
  }

  public async findOneByName(tenantId: number, permissionName: string): Promise<Permission> {
    return this.manager.findOne(Permission, {where: {tenantId, name: permissionName}});
  }

  public async deleteMultiplePermissionsByTenantId(tenantId: string, permissionIds: string[]) {
    this.createQueryBuilder('Permission')
      .where('"tenantId" = :tenantId', {tenantId})
      .andWhere('"id" IN (:...permissionIds)', {permissionIds})
      .delete()
      .execute();
  }

  /**
   * Retrieves Permission entities by given tenant id and permission names from the database.
   *
   * @param {number} tenantId - Current tenant id to use for filtering
   * @param {string[]} permissionNames - Permission names to search for
   * @returns {Promise<Permission[]>} - Promise, retrieving Permission entities
   */
  public async findManyByName(tenantId: number, permissionNames: string[]): Promise<Permission[]> {
    return this.manager.find(Permission, {where: {tenantId, name: In(permissionNames)}});
  }

  public async save(entity: Permission) {
    return this.manager.save(entity);
  }
}
