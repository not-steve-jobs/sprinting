import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {testLocation} from '../locations/data';
import {getTestDate} from '../utils/helpers';
import {testTenantUser} from '../tenantUser/data';

export const testTenantUserLocation: Partial<TenantUserLocation> = {
  tenantId: testTenantUser.tenantId,
  userId: testTenantUser.userId,
  locationId: testLocation.id,
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};
