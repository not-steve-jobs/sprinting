import {AbstractRepository, DeleteResult, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {TenantUserLocation} from './tenantUserLocation.entity';

@EntityRepository(TenantUserLocation)
export class TenantUserLocationRepository extends AbstractRepository<TenantUserLocation> {
  private q(tenantId: number, userId: string): SelectQueryBuilder<TenantUserLocation> {
    return this.createQueryBuilder('TenantUserLocation')
      .where('"TenantUserLocation"."tenantId" = :tenantId', {tenantId})
      .andWhere('"TenantUserLocation"."userId" = :userId', {userId});
  }

  public async getUserLocations(tenantId: number, userId: string): Promise<TenantUserLocation[]> {
    return this.q(tenantId, userId).getMany();
  }

  public async getUserExternalLocationIds(tenantId: number, userId: string): Promise<string[]> {
    const userLocations = await this.q(tenantId, userId)
      .select(['"Location"."externalLocationId"'])
      .leftJoin('TenantUserLocation.location', 'Location')
      .andWhere('"Location"."externalLocationId" is not null')
      .getRawMany();

    return userLocations.map((location) => location.externalLocationId);
  }

  public async save(entity: TenantUserLocation) {
    return this.manager.save(entity);
  }

  public async findOne(tenantId: number, userId: string, locationId: string): Promise<TenantUserLocation> {
    return this.q(tenantId, userId).andWhere('"TenantUserLocation"."locationId" = :locationId', {locationId}).getOne();
  }

  public async deleteAllUsersLocations(tenantId: number, userId: string): Promise<DeleteResult> {
    return this.q(tenantId, userId).delete().execute();
  }

  public async deleteMultiple(userIds: string[]) {
    return userIds.length
      ? this.createQueryBuilder('TenantUserLocation').andWhere('userId IN (:...userIds)', {userIds}).delete().execute()
      : '';
  }

  /**
   * Filter out the TenantUsers without Locations
   * Because of the nature of the filter function we can't use it directly with async and we do such mapping
   *
   * @param {TenantUser[]} tenantUsers - The list with TenantUsers we want to filter out
   * @returns {Promise<TenantUser[]>}
   */
  public async getUsersWithoutLocations(tenantUsers: TenantUser[]): Promise<TenantUser[]> {
    const tenantUsersWithoutLocations: TenantUser[] = await Promise.all(
      tenantUsers.map(async (tenantUser: TenantUser) => {
        const tenantUserLocations: TenantUserLocation[] = await this.getUserLocations(
          tenantUser.tenantId,
          tenantUser.userId,
        );
        if (tenantUserLocations.length === 0) {
          return tenantUser;
        }

        return null;
      }),
    );

    return tenantUsersWithoutLocations.filter((tenantUser) => tenantUser);
  }
}
