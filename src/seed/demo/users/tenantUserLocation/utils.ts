import {Connection} from 'typeorm';

import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {TenantUserLocationRepository} from 'src/modules/tenantUserLocation/tenantUserLocation.repository';

export const getTenantUsersLocations = async (
  db: Connection,
  tenantUsers: TenantUser[],
): Promise<TenantUserLocation[]> => {
  const tenantUserLocationRepository: TenantUserLocationRepository = db.getCustomRepository(
    TenantUserLocationRepository,
  );
  const allTenantUserLocations: TenantUserLocation[][] = await Promise.all(
    tenantUsers.map(async (tenantUser: TenantUser) => {
      return await tenantUserLocationRepository.getUserLocations(tenantUser.tenantId, tenantUser.userId);
    }),
  );

  return allTenantUserLocations.flat();
};

export const getTenantUsersWithoutLocations = async (
  db: Connection,
  tenantUsers: TenantUser[],
): Promise<TenantUser[]> => {
  const tenantUserLocationRepository: TenantUserLocationRepository = db.getCustomRepository(
    TenantUserLocationRepository,
  );
  return tenantUserLocationRepository.getUsersWithoutLocations(tenantUsers);
};
