import {UserPermission} from './permission.interface';
import {Permission} from '../../modules/permission/permission.enum';
import {TenantUserPermission} from 'src/modules/tenantUserPermission/tenantUserPermission.entity';

export class PermissionScopes {
  static getAllUserPermissions(userPermissions: TenantUserPermission[]): UserPermission[] {
    return (userPermissions ?? []).map((tenantUserPermission: TenantUserPermission) => ({
      permName: tenantUserPermission.permission.name,
      permAction: tenantUserPermission.permission.action,
    }));
  }

  /**
   * Returns an array of permission names for user.
   * @returns {string[]} - Filtered permissions
   */
  static getUserPermissionNames(): string[] {
    return [
      Permission.Assignments,
      Permission.Timesheets,
      Permission.Invoices,
      Permission.StaffingRequests,
      Permission.ESignature,
      Permission.Contracts,
    ];
  }

  /**
   * Returns an array of permission names for job contacts.
   * @returns {string[]} - Filtered permissions
   */
  static getJobContactPermissionNames(): string[] {
    return [Permission.TimeSheetApprover, Permission.ReportTo, Permission.BillTo];
  }

  /**
   * Returns an array of permission names related to the SalesForce.
   * @returns {string[]} - Filtered permissions
   */
  static getSalesForcePermissionNames(): string[] {
    return [
      Permission.StaffingRequests,
      Permission.TimeSheetApprover,
      Permission.ReportTo,
      Permission.BillTo,
      Permission.AP,
      Permission.Main,
    ];
  }
  /**
   * Returns an array of permission names related to the SalesForce admin user.
   * @returns {string[]} - Filtered permissions
   */
  static getSalesForceAdminPermissionNames(): string[] {
    return [
      Permission.StaffingRequests,
      Permission.TimeSheetApprover,
      Permission.ReportTo,
      Permission.BillTo,
      Permission.AP,
    ];
  }
}
