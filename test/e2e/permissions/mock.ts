import {PermissionService} from 'src/modules/permission/permission.service';
import {testPermissionName} from './data';

/**
 * Create a new mocked version of PermissionService, with modified getPermissionsByName method
 *
 * The PermissionController endpoint method filters both by tenantId and by the hardcoded PermissionScopes.getUserPermissionNames() values.
 * The testPermissionName is not one of them, so it will never be returned if we don't mock/modify getPermissionsByName method in PermissionService.
 *
 */
export class MockedPermissionService extends PermissionService {
  public async getPermissionsByName(tenantId: number, names: string[]) {
    return super.getPermissionsByName(tenantId, [...names, testPermissionName]);
  }
}
