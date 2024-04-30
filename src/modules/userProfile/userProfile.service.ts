import {CommonIntegrationError} from './../integrations/commonIntegration.error';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {UserProfileRepository} from './userProfile.repository';
import {UpsertUserProfileDto} from './dto/upsertUserProfile.dto';
import {UserProfile} from './userProfile.entity';
import {UserRepository} from '../user/user.repository';
import {User} from '../user/user.entity';
import {SimpleUserDto} from '../user/dto/simpleUser.dto';
import {UserProfileError} from './userProfile.error';
import {DepartmentFunctionService} from '../departmentFunction/departmentFunction.service';
import {DataProvidingEventsService} from '../integrations/dataProviding/dataProvidingEvents.service';
import {UserProfileDto} from './dto/userProfile.dto';
import {Logger} from 'src/core/logger';
import {PreferencesDto} from './dto/preferences.dto';
import {InfoSystemCommandsService} from '../integrations/infoSystem/infoSystemCommands.service';
import {TenantRepository} from '../tenant/tenant.repository';
import {UserFullNameDto} from './dto/userFullName.dto';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {TenantUserCacheService} from 'src/appCache/tenantUserCache.service';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {SalesForceCommandsService} from '../integrations/salesForce/salesForceCommands.service';
import {ClientProfileRepository} from '../clientProfile/clientProfile.repository';
import {TenantUserPermissionRepository} from '../tenantUserPermission/tenantUserPermission.repository';
import {TenantUserLocationRepository} from '../tenantUserLocation/tenantUserLocation.repository';
import {UpdateUserProfileDto} from './dto/updateUserProfile.dto';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userProfileRepository: UserProfileRepository,
    private readonly userRepository: UserRepository,
    private readonly tenantUserRepository: TenantUserRepository,
    private readonly departmentFunctionService: DepartmentFunctionService,
    private readonly dataProvidingEventsService: DataProvidingEventsService,
    private readonly logger: Logger,
    @Inject(forwardRef(() => SalesForceCommandsService))
    private readonly salesForceCommandsService: SalesForceCommandsService,
    @Inject(forwardRef(() => InfoSystemCommandsService))
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
    private readonly tenantRepository: TenantRepository,
    private readonly tenantUserCache: TenantUserCacheService,
    private readonly clientProfileRepository: ClientProfileRepository,
    private readonly tenantUserPermissionRepository: TenantUserPermissionRepository,
    private readonly tenantUserLocationRepository: TenantUserLocationRepository,
  ) {}

  public async upsert(
    tenantId: number,
    id: string,
    userData: UpsertUserProfileDto | SimpleUserDto,
    tenantUser: TenantUser,
  ): Promise<any> {
    try {
      const userProfile = new UserProfile(userData as UpsertUserProfileDto);

      userProfile.id = id;

      const isValidDepartmentFunction = await this.departmentFunctionService.validateDepartmentFunction(
        tenantId,
        userProfile.departmentId,
        userProfile.departmentFunctionId,
      );
      if (!isValidDepartmentFunction) {
        throw new UserProfileError.UserProfileInconsistentDepartmentFunction();
      }

      const user = new User(userData as SimpleUserDto);
      user.id = id;

      const updatedUserProfile = await this.userProfileRepository.save(userProfile);

      const updatedUser = await this.userRepository.save(user);
      await this.dataProvidingEventsService.sendUserUpdated(tenantId, updatedUser, updatedUserProfile);

      const tenant = await this.tenantRepository.findOneWithRelations(tenantId);
      await this.infoSystemCommandsService.sendContactUpdated(tenant, updatedUser, updatedUserProfile);

      const clientProfile = await this.clientProfileRepository.findOne(user.clientId);
      const permissions = await this.tenantUserPermissionRepository.getUserPermissions(tenantId, updatedUser.id);
      const userPermissionIds = await permissions.map((tenantUserPermission) => tenantUserPermission.permissionId);
      const userPermissionNames = await this.tenantUserPermissionRepository.getUserPermissionNames(
        tenant.id,
        user.id,
        userPermissionIds,
      );

      const externalLocationIds = await this.tenantUserLocationRepository.getUserExternalLocationIds(
        tenant.id,
        updatedUser.id,
      );

      await this.salesForceCommandsService.sendContactUpdated(tenant, updatedUser, updatedUserProfile, tenantUser, {
        clientProfile,
        permissionNames: userPermissionNames,
        externalLocationIds,
      });

      await this.tenantUserCache.invalidate(tenantId, tenantUser.user.B2CId);

      return {...updatedUser, userProfile: updatedUserProfile};
    } catch (error) {
      throw new UserProfileError.UserProfileUpdateError(null, error);
    }
  }

  // NOTE: This code should probably be removed when #2909 tech debt task is implemented
  public async update(
    tenantId: number,
    id: string,
    updatedUserProperties: UpdateUserProfileDto,
    tenantUser: TenantUser,
  ): Promise<UserProfile> {
    try {
      const userProfile = await this.userProfileRepository.findOne(id);

      if (!userProfile) {
        throw new UserProfileError.UserProfileDoesNotExistError();
      } else if (tenantUser.tenantId !== tenantId || tenantUser.userId !== userProfile.id) {
        throw new UserProfileError.UserProfileAccessDeniedError();
      }

      Object.assign(userProfile, updatedUserProperties);
      await this.userProfileRepository.save(userProfile);

      return userProfile;
    } catch (error) {
      throw new UserProfileError.UserProfileUpdateError(null, error);
    }
  }

  public async getOne(userId: string) {
    return this.userProfileRepository.findOne(userId);
  }

  public async findByExternalContactId(externalContactId: string) {
    return this.userProfileRepository.findByExternalContactId(externalContactId);
  }

  public async get(tenantId: number, userId: string): Promise<UserProfileDto> {
    const tenantUser = await this.tenantUserRepository.findOne(tenantId, userId);
    if (!tenantUser) {
      throw new CommonIntegrationError.UserCountryBrandNotFound();
    }

    return this.userProfileRepository.findOneWithUser(userId);
  }

  public async savePreferences(
    tenantId: number,
    userId: string,
    preferences: PreferencesDto,
    tenantUser: TenantUser,
  ): Promise<UserProfileDto> {
    try {
      let userProfileForUpdate: UserProfile;
      try {
        userProfileForUpdate = await this.userProfileRepository.findOne(userId);
      } catch (error) {
        throw new UserProfileError.UserProfileGetError(null, error);
      }

      userProfileForUpdate.preferences = {...(userProfileForUpdate.preferences ?? {}), ...preferences};
      await this.userProfileRepository.save(userProfileForUpdate);

      await this.tenantUserCache.invalidate(tenantId, tenantUser.user.B2CId);

      return userProfileForUpdate;
    } catch (error) {
      throw new UserProfileError.UserProfileUpdatePreferencesError(null, error);
    }
  }

  /**
   * Retrieves full names of users by given user ids. Data is returned in a simple object, the key is the user id and the value is the full name (first and last name)
   *
   * @param {string[]} userIds - User ids to use for filtering
   * @returns {Promise<UserFullNameDto>} - Promise, retrieving full user names
   */
  public async getFullNames(userIds: string[]): Promise<UserFullNameDto> {
    const users: UserProfile[] = await this.userProfileRepository.findMany(userIds);
    const names: UserFullNameDto = {};
    users.forEach((user: UserProfile) => {
      names[user.id] = `${user.firstName} ${user.lastName}`;
    });
    return names;
  }

  /**
   * Find user profile with possibility to gether other relations
   *
   * @param {string} userId
   * @param {string[]} [relations=[]] - ['user', 'user.client', user.client.clientProfile]
   * @return {*}  {Promise<UserProfile>}
   * @memberof UserProfileService
   */
  public async findOneWithRelations(userId: string, relations: string[] = []): Promise<UserProfile> {
    return this.userProfileRepository.findOneWithRelations(userId, relations);
  }
}
