import {AuthRoles} from 'src/core/auth/authRoles';
import {PermissionScopes} from 'src/core/permission/permissionScopes';
import {SalesForcePermissions} from '../eventModels/salesForcePermissions.enum';
import {Permission} from 'src/modules/permission/permission.enum';
import {SalesForceError} from '../salesForce.error';
import {PermissionListDto} from 'src/modules/permission/dto/permissionList.dto';

interface PermissionsData {
  permissionIds: string[];
  permissionNames: string[];
}
/**
 * Map permissions SF -> CLP
 *
 * @param {string} [allPermissions=''] - those are permissions received from SF (e.g. "Main;Bill To;Report To;Orderer;Time Sheet Approver")
 * @param {PermissionListDto[]} availableSalesForcePermissions - all permissions on CLP side which are related to SF
 * @return {*}  {Promise<[boolean, PermissionsData]>}
 */
export const mapSalesForcePermissions = async (
  allPermissions: string = '',
  availableSalesForcePermissions: PermissionListDto[],
): Promise<PermissionsData> => {
  const permissions: PermissionsData = {permissionIds: [], permissionNames: []};

  const getPermissionId = (targetPermissionName: string, permissions: PermissionsData): void => {
    const permission = (availableSalesForcePermissions ?? []).find(
      ({name: permissionName}) => permissionName === targetPermissionName,
    );

    if (permission?.id && !permissions.permissionIds.includes(permission?.id)) {
      permissions.permissionIds = [...permissions.permissionIds, permission.id];
      permissions.permissionNames = [...permissions.permissionNames, permission.name];
    }
  };

  allPermissions.split(';').forEach((permission) => {
    switch (permission) {
      case SalesForcePermissions.Main:
        PermissionScopes.getSalesForceAdminPermissionNames().forEach((permissionName) =>
          getPermissionId(permissionName, permissions),
        );
        break;
      case SalesForcePermissions.BillTo:
        getPermissionId(Permission.BillTo, permissions);
        break;
      case SalesForcePermissions.ReportTo:
        getPermissionId(Permission.ReportTo, permissions);
        break;
      case SalesForcePermissions.Orderer:
        getPermissionId(Permission.StaffingRequests, permissions);
        break;
      case SalesForcePermissions.TimeSheetApprover:
        getPermissionId(Permission.TimeSheetApprover, permissions);
        break;
      case SalesForcePermissions.AP:
        getPermissionId(Permission.AP, permissions);
        break;
      default:
        throw new SalesForceError.PermissionNotFound({permissionName: permission});
    }
  });
  return permissions;
};

/**
 * Map permissions CLP -> SF
 *
 * @param {number} roleId - CLP user role id
 * @param {string[]} permissionNames - all available user permissions
 * @return {*}  {Promise<string>} - (e.g. "Main;Bill To;Report To;Orderer;Time Sheet Approver")
 */
export const mapUserPermissions = async (roleId: number, permissionNames: string[]): Promise<string> => {
  let permissions: string[] = [];

  if (AuthRoles.isAdmin(roleId)) {
    permissions = [...permissions, SalesForcePermissions.Main];
  }

  permissionNames.forEach((permissionName) => {
    switch (permissionName) {
      case Permission.BillTo:
        permissions = [...permissions, SalesForcePermissions.BillTo];
        break;
      case Permission.ReportTo:
        permissions = [...permissions, SalesForcePermissions.ReportTo];
        break;
      case Permission.StaffingRequests:
        permissions = [...permissions, SalesForcePermissions.Orderer];
        break;
      case Permission.TimeSheetApprover:
        permissions = [...permissions, SalesForcePermissions.TimeSheetApprover];
        break;
      case Permission.AP:
        permissions = [...permissions, SalesForcePermissions.AP];
        break;

      default:
    }
  });

  return permissions.join(';');
};
