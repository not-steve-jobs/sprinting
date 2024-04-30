export enum AuthRolesEnum {
  ClientAdmin = 1,
  ClientStaff = 2,
  Associate = 3,
  Candidate = 4,
  Common = 5,
}

export class AuthRoles {
  static readonly user = 'client-staff';
  static readonly admin = 'client-admin';
  static readonly associate = 'associate';
  static readonly candidate = 'candidate';

  static roleFromRoleId(roleId: number): 'client-staff' | 'client-admin' | 'associate' | 'candidate' | undefined {
    switch (roleId) {
      case AuthRolesEnum.ClientAdmin:
        return AuthRoles.admin;
      case AuthRolesEnum.ClientStaff:
        return AuthRoles.user;
      case AuthRolesEnum.Associate:
        return AuthRoles.associate;
      case AuthRolesEnum.Candidate:
        return AuthRoles.candidate;
      default:
        return undefined;
    }
  }
  static isAdmin(roleId: number): boolean {
    return AuthRoles.admin === AuthRoles.roleFromRoleId(roleId);
  }
}
