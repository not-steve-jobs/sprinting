import {AbstractRepository, DeleteResult, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {TenantUserPermission} from './tenantUserPermission.entity';

@EntityRepository(TenantUserPermission)
export class TenantUserPermissionRepository extends AbstractRepository<TenantUserPermission> {
  private q(tenantId: number, userId: string): SelectQueryBuilder<TenantUserPermission> {
    return this.createQueryBuilder('TenantUserPermission')
      .where('"TenantUserPermission"."tenantId" = :tenantId', {tenantId})
      .andWhere('"TenantUserPermission"."userId" = :userId', {userId});
  }

  public async findOne(tenantId: number, userId: string, permissionId: string): Promise<TenantUserPermission> {
    return this.q(tenantId, userId).andWhere('"permissionId" = :permissionId', {permissionId}).getOne();
  }

  public async getUserPermissions(tenantId: number, userId: string): Promise<TenantUserPermission[]> {
    return this.q(tenantId, userId).getMany();
  }

  public async getUserPermissionNames(tenantId: number, userId: string, permissionIds: string[]): Promise<string[]> {
    if (permissionIds.length === 0) {
      return [];
    }

    const permissions = await this.q(tenantId, userId)
      .leftJoinAndSelect('TenantUserPermission.permission', 'Permission')
      .andWhere('"permissionId" IN (:...permissionIds)', {permissionIds})
      .getMany();

    return permissions.map((tenantUserPermission) => tenantUserPermission.permission.name);
  }

  public async save(entity: TenantUserPermission) {
    return this.manager.save(entity);
  }

  public async deleteAllUsersPermissions(tenantId: number, userId: string): Promise<DeleteResult> {
    return this.q(tenantId, userId).delete().execute();
  }

  public async deleteMultiple(userIds: string[]) {
    return userIds.length
      ? this.createQueryBuilder('TenantUserPermission')
          .andWhere('userId IN (:...userIds)', {userIds})
          .delete()
          .execute()
      : '';
  }

  public async deleteMultiplePermissionsByTenantId(tenantId: string, permissionIds: string[]) {
    this.createQueryBuilder('TenantUserPermission')
      .where('"tenantId" = :tenantId', {tenantId})
      .andWhere('"permissionId" IN (:...permissionIds)', {permissionIds})
      .delete()
      .execute();
  }

  /**
   * Retrieves Permission entities by given tenant and permission ids from the database.
   *
   * @param {number} tenantId - Tenant id to use for filtering
   * @param {string[]} permissionIds - Array of permission ids
   * @returns {Promise<JobContactDto[]>} - Promise, retrieving Permission entities
   */
  public async findAllByPermissionIds(tenantId: number, permissionIds: string[]): Promise<TenantUserPermission[]> {
    return this.createQueryBuilder('TenantUserPermission')
      .where('"tenantId" = :tenantId', {tenantId})
      .andWhere('"permissionId" IN (:...permissionIds)', {permissionIds})
      .getMany();
  }

  /**
   * Filter out the TenantUsers without Permissions
   * Because of the nature of the filter function we can't use it directly with async and we do such mapping
   *
   * @param {TenantUser[]} tenantUsers - The list with TenantUsers we want to filter out
   * @returns {Promise<TenantUser[]>}
   */
  public async getUsersWithoutPermissions(tenantUsers: TenantUser[]): Promise<TenantUser[]> {
    const tenantUsersWithoutPermissions: TenantUser[] = await Promise.all(
      tenantUsers.map(async (tenantUser: TenantUser) => {
        const tenantUserPermissions: TenantUserPermission[] = await this.getUserPermissions(
          tenantUser.tenantId,
          tenantUser.userId,
        );
        if (tenantUserPermissions.length === 0) {
          return tenantUser;
        }

        return null;
      }),
    );

    return tenantUsersWithoutPermissions.filter((tenantUser) => tenantUser);
  }
}
