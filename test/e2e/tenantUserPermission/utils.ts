import {TenantUserPermission} from 'src/modules/tenantUserPermission/tenantUserPermission.entity';

export const getTenantUserPermissionPrimaryKeys = (
  entity: Partial<TenantUserPermission>,
): Pick<TenantUserPermission, 'tenantId' | 'userId' | 'permissionId'> => {
  return {
    tenantId: entity.tenantId,
    userId: entity.userId,
    permissionId: entity.permissionId,
  };
};

export const getTestTenantUserPermissionsPrimaryKeys = (
  entities: Partial<TenantUserPermission>[],
): Pick<TenantUserPermission, 'tenantId' | 'userId' | 'permissionId'>[] => {
  return entities.map(getTenantUserPermissionPrimaryKeys);
};
