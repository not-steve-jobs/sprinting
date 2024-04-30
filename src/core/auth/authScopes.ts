import {AuthRoles} from './authRoles';

export class AuthScopes {
  static readonly associate = 'associate';
  static readonly candidate = 'candidate';
  static readonly roleUser = 'role-client-staff';
  static readonly roleAdmin = 'role-client-admin';
  static readonly self = 'self';
  static readonly roleSuperAdmin = 'role-superAdmin';

  static scopeForRole(role: AuthRoles): string {
    return `role-${role}`;
  }

  static scopeForTenantId(tenantId: number): string {
    return `tenant-${tenantId}`;
  }

  static scopeForUserId(userId: string): string {
    return `user-${userId}`;
  }
}
