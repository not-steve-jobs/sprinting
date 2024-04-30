import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {TenantUserPermissionRepository} from './tenantUserPermission.repository';
import {TenantUserPermissionError} from './tenantUserPermission.error';
import {JobContactDto} from './dto/jobContact.dto';
import {PermissionService} from '../permission/permission.service';
import {PermissionScopes} from 'src/core/permission/permissionScopes';
import {PlainObject} from '../common/common.dto';
import {TenantUserPermission} from './tenantUserPermission.entity';
import {PermissionListDto} from '../permission/dto/permissionList.dto';
import {UserProfileService} from '../userProfile/userProfile.service';
import {UserService} from '../user/user.service';
import {TenantUser} from '../tenantUser/tenantUser.entity';

@Injectable()
export class TenantUserPermissionService {
  constructor(
    private readonly tenantUserPermissionRepository: TenantUserPermissionRepository,
    private readonly permissionService: PermissionService,
    private readonly userProfileService: UserProfileService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async getUserPermissions(tenantId: number, userId: string): Promise<string[]> {
    try {
      const userPermissions = await this.tenantUserPermissionRepository.getUserPermissions(tenantId, userId);
      return userPermissions.map(({permissionId}) => permissionId);
    } catch (error) {
      throw new TenantUserPermissionError.UserPermissionUserPermissionsError(null, error);
    }
  }

  /**
   * Retrieves all available users with correct permissions for all types of job contacts. First the users are filtered by tenant id and corresponding permissions. Then, the full name of each filtered user is retrieved. Finally, from the whole information an object is constructed and returned.
   *
   * @param {number} tenantId - Tenant id to use for filtering
   * @returns {Promise<JobContactDto[]>} - Promise, retrieve job contacts
   */
  public async getAvailableJobContacts(tenantId: number): Promise<JobContactDto[]> {
    try {
      const permJobContacts: JobContactDto[] = await this.getPermissionsJobContacts(tenantId); //if there are no corresponding permission contacts, then the functionality is not used at all
      if (permJobContacts.length > 0) {
        const jobContacts: JobContactDto[] = [...permJobContacts, ...(await this.getAdminJobContacts(tenantId))];
        return await this.getUserFullNames(jobContacts);
      } else {
        return [];
      }
    } catch (error) {
      throw new TenantUserPermissionError.UserPermissionUserPermissionsError(null, error);
    }
  }

  /**
   * Retrieves and adds full names of the given job contacts.
   *
   * @param {JobContactDto[]} contacts - Contacts array to add full names to
   * @returns {Promise<JobContactDto[]>} - Promise, retrieving job contacts with full names
   */
  private async getUserFullNames(contacts: JobContactDto[]): Promise<JobContactDto[]> {
    const userIds: string[] = await contacts.map((item) => item.id);
    const fullNames: PlainObject = await this.userProfileService.getFullNames(userIds);
    contacts.forEach((contact: JobContactDto) => {
      contact.fullName = fullNames[contact.id];
    });
    return contacts;
  }

  /**
   * Returns an object of permissions for a given tenant.
   *
   * @param {number} tenantId - Tenant id to use for filtering
   * @returns {Promise<PlainObject|null>} - Promise, retrieving object permissions
   */
  private async getAllowedPermissions(tenantId: number): Promise<PlainObject | null> {
    const permissions: PlainObject = {};
    const jobContactsPermissions: PermissionListDto[] = await this.permissionService.getPermissionsByName(
      tenantId,
      PermissionScopes.getJobContactPermissionNames(),
    );
    if (jobContactsPermissions.length > 0) {
      jobContactsPermissions.forEach((permission: PermissionListDto) => {
        permissions[permission.name] = permission.id;
      });
      return permissions;
    } else {
      return null;
    }
  }

  /**
   * Returns a job contacts list with users with correct permissions for a given tenant.
   *
   * @param {number} tenantId - Tenant id to use for filtering
   * @returns {Promise<JobContactDto[]>} - Promise, retrieving job contacts with correct permissions
   */
  private async getPermissionsJobContacts(tenantId: number): Promise<JobContactDto[]> {
    const contacts: JobContactDto[] = [];
    const permissions: PlainObject = await this.getAllowedPermissions(tenantId);
    if (permissions) {
      const tenantUserPermissions: TenantUserPermission[] = await this.tenantUserPermissionRepository.findAllByPermissionIds(
        tenantId,
        Object.values(permissions),
      );
      if (tenantUserPermissions.length > 0) {
        const importedUserIds: string[] = [];
        let currentPermId: string = '';
        let currentIndex: number = 0;
        const findNameOf: Function = (permId: string): string => {
          return Object.keys(permissions).find((key) => permissions[key] === permId);
        };
        tenantUserPermissions.forEach(async (tenantUserPerm: TenantUserPermission) => {
          currentIndex = importedUserIds.indexOf(tenantUserPerm.userId);
          currentPermId = findNameOf(tenantUserPerm.permissionId);
          if (currentIndex < 0) {
            importedUserIds.push(tenantUserPerm.userId);
            contacts.push({
              id: tenantUserPerm.userId,
              fullName: '',
              permissions: [currentPermId],
            });
          } else {
            contacts[currentIndex].permissions.push(currentPermId);
          }
        });
      }
    }
    return contacts;
  }

  /**
   * Returns a job contacts list with admin users for a given tenant.
   *
   * @param {number} tenantId - Tenant id to use for filtering
   * @returns {Promise<JobContactDto[]>} - Promise, retrieving job contacts with admin role
   */
  private async getAdminJobContacts(tenantId: number): Promise<JobContactDto[]> {
    const admins: TenantUser[] = await this.userService.getAllTenantAdmins(tenantId);
    return admins.map((admin: TenantUser) => {
      return {
        id: admin.userId,
        fullName: '',
        permissions: [admin.role.name],
      };
    });
  }
}
