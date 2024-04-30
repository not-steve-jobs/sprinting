import {TenantUser} from './tenantUser.entity';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';

@EntityRepository(TenantUser)
export class TenantUserRepository extends AbstractRepository<TenantUser> {
  private q(tenantId: number, userId: string): SelectQueryBuilder<TenantUser> {
    return this.createQueryBuilder('TenantUser')
      .where('"TenantUser"."tenantId" = :tenantId', {tenantId})
      .andWhere('"TenantUser"."userId" = :userId', {userId});
  }

  public async findOne(tenantId: number, userId: string): Promise<TenantUser> {
    return this.q(tenantId, userId)
      .leftJoinAndSelect('TenantUser.user', 'User')
      .leftJoinAndSelect('TenantUser.status', 'Status')
      .leftJoinAndSelect('TenantUser.role', 'Role')
      .leftJoinAndSelect('TenantUser.tenantUserLocations', 'TenantUserLocations')
      .leftJoinAndSelect('TenantUserLocations.location', 'TenantUserLocation')
      .leftJoinAndSelect('TenantUser.tenantUserPermissions', 'TenantUserPermissions')
      .leftJoinAndSelect('TenantUserPermissions.permission', 'Permission')
      .leftJoinAndSelect('User.userProfile', 'UserProfile')
      .leftJoinAndSelect('User.client', 'Client')
      .leftJoinAndSelect('UserProfile.mainLocation', 'Location')
      .leftJoinAndSelect('UserProfile.department', 'Department')
      .leftJoinAndSelect('UserProfile.departmentFunction', 'DepartmentFunction')
      .getOne();
  }

  public async getAuthUserData(tenantId: number, B2CId: string): Promise<TenantUser> {
    const query = this.createQueryBuilder('TenantUser')
      .where('"TenantUser"."tenantId" = :tenantId', {tenantId})
      .innerJoinAndSelect('TenantUser.user', 'User', '"User"."B2CId" = :B2CId', {B2CId})
      // TODO: Bug previously referenced in https://dev.azure.com/ClientAccess/Client%20Access/_workitems/edit/2355
      // .leftJoinAndSelect('TenantUser.tenant', 'Tenant', '"Tenant"."id" = "TenantUser"."tenantId"')
      .leftJoinAndSelect('TenantUser.status', 'Status')
      .leftJoinAndSelect('TenantUser.role', 'Role')
      .leftJoinAndSelect('TenantUser.tenantUserLocations', 'TenantUserLocations')
      .leftJoinAndSelect('TenantUserLocations.location', 'TenantUserLocation')
      .leftJoinAndSelect('TenantUser.tenantUserPermissions', 'TenantUserPermissions')
      .leftJoinAndSelect('TenantUserPermissions.permission', 'Permission')
      .leftJoinAndSelect('User.userProfile', 'UserProfile')
      .leftJoinAndSelect('User.client', 'Client')
      .leftJoinAndSelect('UserProfile.mainLocation', 'Location')
      .leftJoinAndSelect('UserProfile.department', 'Department')
      .leftJoinAndSelect('UserProfile.departmentFunction', 'DepartmentFunction');
    return query.getOne();
  }

  // used for seeds
  public async findAll(): Promise<TenantUser[]> {
    return this.createQueryBuilder('TenantUser').leftJoinAndSelect('TenantUser.user', 'User').getMany();
  }

  /**
   * Find all Users which are associated with a specific Tenant
   *
   * @param {number} tenantId - The ID of the Tenant which has to be used to filter out the user
   * @returns {Promise<TenantUser[]>} - List with all of the users which belongs to the provided Tenant
   */
  public async findAllByTenant(tenantId: number): Promise<TenantUser[]> {
    return this.createQueryBuilder('TenantUser')
      .where('"TenantUser"."tenantId" = :tenantId', {tenantId})
      .leftJoinAndSelect('TenantUser.user', 'User')
      .leftJoinAndSelect('TenantUser.role', 'Role')
      .leftJoinAndSelect('User.userProfile', 'UserProfile')
      .getMany();
  }

  public async save(entity: TenantUser) {
    return this.manager.save(entity);
  }

  public async deleteMultiple(userIds: string[]) {
    return userIds.length
      ? this.createQueryBuilder('TenantUser').andWhere('userId IN (:...userIds)', {userIds}).delete().execute()
      : '';
  }
}
