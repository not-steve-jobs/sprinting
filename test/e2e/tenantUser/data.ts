import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {testTenant} from '../tenant/data';
import {testUser} from '../users/data';
import {testRole} from '../role/data';
import {testUserActiveStatus} from '../status/data';
import {getTestDate} from '../utils/helpers';

export const testTenantUser: Partial<TenantUser> = {
  tenantId: testTenant.id,
  userId: testUser.id,
  roleId: testRole.id,
  activationDate: new Date(),
  statusId: testUserActiveStatus.id,
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};
