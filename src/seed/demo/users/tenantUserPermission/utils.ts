import {Connection} from 'typeorm';

import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {TenantUserPermission} from 'src/modules/tenantUserPermission/tenantUserPermission.entity';
import {TenantUserPermissionRepository} from 'src/modules/tenantUserPermission/tenantUserPermission.repository';

export const getTenantUsersPermissions = async (
  db: Connection,
  tenantUsers: TenantUser[],
): Promise<TenantUserPermission[]> => {
  const tenantUserPermissionRepository: TenantUserPermissionRepository = db.getCustomRepository(
    TenantUserPermissionRepository,
  );
  const allTenantUserPermissions: TenantUserPermission[][] = await Promise.all(
    tenantUsers.map(async (tenantUser: TenantUser) => {
      return await tenantUserPermissionRepository.getUserPermissions(tenantUser.tenantId, tenantUser.userId);
    }),
  );

  return allTenantUserPermissions.flat();
};

export const getTenantUsersWithoutPermissions = async (
  db: Connection,
  tenantUsers: TenantUser[],
): Promise<TenantUser[]> => {
  const tenantUserPermissionRepository: TenantUserPermissionRepository = db.getCustomRepository(
    TenantUserPermissionRepository,
  );
  return tenantUserPermissionRepository.getUsersWithoutPermissions(tenantUsers);
};
