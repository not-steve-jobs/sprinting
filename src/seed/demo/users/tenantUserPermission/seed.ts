import {Connection} from 'typeorm/connection/Connection';

import {AuthRoles} from 'src/core/auth/authRoles';
import {Permission} from 'src/modules/permission/permission.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {TenantUserPermissionDto} from 'src/modules/tenantUserPermission/dto/tenantUserPermission.dto';
import {TenantUserPermission} from 'src/modules/tenantUserPermission/tenantUserPermission.entity';
import {TenantUserPermissionRepository} from 'src/modules/tenantUserPermission/tenantUserPermission.repository';

import {isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {getTenantUsersPermissions, getTenantUsersWithoutPermissions} from './utils';

/**
 * Seed demo data for the TenantUserPermissions in the system
 * We seed only Permissions for the TenantUsers which don't have any assigned to them yet
 *
 * @param {Connection} db - The active connection with the database
 * @param {TenantUser[]} tenantUsers - List with all of the TenantUser for which we want to generate Permissions
 * @param {Permission[]} permissions - List with all of the Permissions for which we want to generate for the User
 * @returns {Promise<TenantUserPermission[]>} - A list with all of the seeded TenantUserPermissions
 */
export const seedTenantUserPermissions = async (
  db: Connection,
  tenantUsers: TenantUser[],
  permissions: Permission[],
): Promise<TenantUserPermission[]> => {
  log('Seeding TenantUser Permissions', 3);
  const stopwatch = new Stopwatch();

  const tenantUsersWithoutPermissions: TenantUser[] = await getTenantUsersWithoutPermissions(db, tenantUsers);
  const tenantUserPermissionsData: TenantUserPermissionDto[] = generateTenantUserPermissions(
    tenantUsersWithoutPermissions,
    permissions,
  );

  const oldTenantUsersPermissions: TenantUserPermission[] = await getTenantUsersPermissions(db, tenantUsers);
  const createdTenantUserPermissions: TenantUserPermission[] = await Promise.all(
    tenantUserPermissionsData.map(async (data: TenantUserPermissionDto) => {
      // TODO: Do we need that? It's an old leftover
      // await tenantUserPermissionRepository.deleteAllUsersPermissions(data.tenantId, data.userId);

      return await seedTenantUserPermission(db, data);
    }),
  );

  const tenantUsersPermissions: TenantUserPermission[] = [
    ...oldTenantUsersPermissions,
    ...createdTenantUserPermissions,
  ];

  stopwatch.stopAndLogElapsedTime(`count: ${tenantUsersPermissions.length}`);
  return tenantUsersPermissions;
};

/**
 * Seed demo data for a TenantUserPermission
 *
 * @param {Connection} db - The active connection with the database
 * @param {TenantUserPermissionDto} tenantUserPermissionData - All the data required to create the new TenantUserLocation record
 * @returns {Promise<TenantUserPermission>}
 */
export const seedTenantUserPermission = async (
  db: Connection,
  tenantUserPermissionData: TenantUserPermissionDto,
): Promise<TenantUserPermission> => {
  const isDebug = isDebugMode();
  const tenantUserPermissionRepository: TenantUserPermissionRepository = db.getCustomRepository(
    TenantUserPermissionRepository,
  );

  let tenantUserPermission: TenantUserPermission = await tenantUserPermissionRepository.findOne(
    tenantUserPermissionData.tenantId,
    tenantUserPermissionData.userId,
    tenantUserPermissionData.permissionId,
  );

  if (tenantUserPermission) {
    return tenantUserPermission;
  }

  tenantUserPermission = new TenantUserPermission(tenantUserPermissionData);

  logSuccess(
    `+ Seed TenantUserPermission [#${tenantUserPermission.permissionId}] for User [#${tenantUserPermission.userId}]`,
    4,
    isDebug,
  );
  return tenantUserPermissionRepository.save(tenantUserPermission);
};

/**
 * Generate some demo data for the TenantUserPermissions
 *
 * @param {TenantUser[]} tenantUsers - List with all available TenantUsers which should be used to assign permissions to
 * @param {Permission[]} permissions - List with all Permissions which should be used to provide access for the Users
 * @returns {TenantUserPermissionDto[]} - Generated data for the TenantUserPermissions
 */
export const generateTenantUserPermissions = (
  tenantUsers: TenantUser[],
  permissions: Permission[],
): TenantUserPermissionDto[] => {
  const tenantUserPermissionData: TenantUserPermissionDto[] = [];

  tenantUsers.forEach(({roleId: userRoleId, userId, tenantId}) => {
    // admins have all permissions and we don't need to insert them into table
    if (!AuthRoles.isAdmin(userRoleId)) {
      permissions
        .filter(({tenantId: permissionTenantId}) => permissionTenantId === tenantId)
        .forEach(({id: permissionId}) => {
          tenantUserPermissionData.push({
            permissionId,
            userId,
            tenantId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
    }
  });

  return tenantUserPermissionData;
};
