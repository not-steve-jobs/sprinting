import {TenantUserPermission} from 'src/modules/tenantUserPermission/tenantUserPermission.entity';
import {testChangedPermission, testPermission} from '../permissions/data';
import {testTenantUser} from '../tenantUser/data';
import {getTestDate} from '../utils/helpers';

export const testTenantUserPermission: Partial<TenantUserPermission> = {
  tenantId: testTenantUser.tenantId,
  userId: testTenantUser.userId,
  permissionId: testPermission.id,
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testChangedTenantUserPermission: Partial<TenantUserPermission> = {
  tenantId: testTenantUser.tenantId,
  userId: testTenantUser.userId,
  permissionId: testChangedPermission.id,
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testTenantUserPermissions: Partial<TenantUserPermission>[] = [
  testTenantUserPermission,
  testChangedTenantUserPermission,
];
