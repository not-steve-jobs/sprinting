import {Permission} from 'src/modules/permission/permission.entity';
import {PermissionAction} from 'src/modules/permission/permission.enum';

import {getTestDate} from '../utils/helpers';
import {testTenant} from '../tenant/data';

export const testPermissionName = 'staffingRequestTest';

export const testPermission: Partial<Permission> = {
  id: '12345678-0000-4005-0000-000000000001',
  tenantId: testTenant.id,
  action: PermissionAction.Write,
  orderId: 200,
  name: testPermissionName,
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testChangedPermission: Partial<Permission> = {
  id: '12345678-0000-4005-0000-000000000002',
  tenantId: testTenant.id,
  action: PermissionAction.Write,
  orderId: 200,
  name: 'staffingRequestTestChanged',
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testPermissions: Partial<Permission>[] = [testPermission, testChangedPermission];
