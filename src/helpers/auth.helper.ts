import {Injectable} from '@nestjs/common';
import {TenantUser} from '../modules/tenantUser/tenantUser.entity';
import {AuthScopes} from '../core/auth/authScopes';
import {AuthRoles} from '../core/auth/authRoles';

@Injectable()
export class AuthHelper {
  public async getScopesForUser(tenantUser: TenantUser): Promise<string[]> {
    const roleScopes = [AuthScopes.scopeForRole(AuthRoles.roleFromRoleId(tenantUser.roleId))];
    const tenantScope = AuthScopes.scopeForTenantId(tenantUser.tenantId);
    const scopes = [tenantScope, ...roleScopes];
    return scopes;
  }
}
