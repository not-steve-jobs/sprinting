import {ClientProfileRepository} from 'src/modules/clientProfile/clientProfile.repository';
import {SalesForceCommandsService} from './../integrations/salesForce/salesForceCommands.service';
import {TenantUserLocation} from '../tenantUserLocation/tenantUserLocation.entity';
import {TenantUserPermission} from '../tenantUserPermission/tenantUserPermission.entity';
import {Injectable} from '@nestjs/common';
import {getConnection, getCustomRepository} from 'typeorm';
import {UserRepository} from './user.repository';
import {UserDto} from './dto/user.dto';
import {SimpleUserDto} from './dto/simpleUser.dto';
import {CreateUserDto} from './dto/createUser.dto';
import {UpdateUserDto, UpdateUserPersonalInformationDto} from './dto/updateUser.dto';
import {User} from './user.entity';
import {TenantUserInvitationService} from '../tenantUserInvitation/tenantUserInvitation.service';
import {UserServiceErrors} from './user.error';
import {UserProfile} from '../userProfile/userProfile.entity';
import {UserProfileRepository} from '../userProfile/userProfile.repository';
import {TenantUserPermissionRepository} from '../tenantUserPermission/tenantUserPermission.repository';
import {TenantUserLocationRepository} from '../tenantUserLocation/tenantUserLocation.repository';
import {TenantUserLocationService} from '../tenantUserLocation/tenantUserLocation.service';
import {TenantUserPermissionService} from '../tenantUserPermission/tenantUserPermission.service';
import {RoleService} from '../role/role.service';
import {StatusService} from '../status/status.service';
import {InfoSystemCommandsService} from '../integrations/infoSystem/infoSystemCommands.service';
import {FilteringOptions, Pagination, PaginationOptions, SortingOptions} from '../common/paginate';
import {AuthRoles} from '../../core/auth/authRoles';
import {DepartmentFunctionService} from '../departmentFunction/departmentFunction.service';
import {BackgroundNotificationService} from '../sendBackgroundNotification/backgroundNotification/backgroundNotification.service';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {UserStatus} from '../status/status.enum';
import {TenantUserInvitation} from '../tenantUserInvitation/tenantUserInvitation.entity';
import {DisableUserDto} from './dto/disableUser.dto';
import {DisableReasonEnum} from '../disableReason/disableReason.enum';
import {DisableReasonService} from '../disableReason/disableReason.service';
import {TenantUserInvitationDto} from '../tenantUserInvitation/dto/tenantUserInvitation.dto';
import {TenantRepository} from '../tenant/tenant.repository';
import {InfoCreateUserDto} from './dto/infoCreateUser.dto';
import {InfoUpdateUserDto} from './dto/infoUpdateUser.dto';
import {EnableUserDto} from './dto/enableUserDto';
import {DisableReason} from '../disableReason/disableReason.entity';
import {AccountDisabledAdminsNotification} from '../sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/accountDisabledAdminsNotification.interface';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {DisableUserOrigin} from './user.enum';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {DataProvidingEventsService} from '../integrations/dataProviding/dataProvidingEvents.service';
import {Logger} from 'src/core/logger';
import {SalesForceCreateUserDto} from './dto/salesForceCreateUser.dto';
import {isNil} from 'lodash';
import {SalesForceUpdateUserDto} from './dto/salesForceUpdateUser.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly tenantUserInvitationService: TenantUserInvitationService,
    private readonly roleService: RoleService,
    private readonly statusService: StatusService,
    private readonly tenantUserRepository: TenantUserRepository,
    private readonly tenantUserLocationService: TenantUserLocationService,
    private readonly tenantUserPermissionService: TenantUserPermissionService,
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly departmentFunctionService: DepartmentFunctionService,
    private readonly notify: BackgroundNotificationService,
    private readonly disableReasonService: DisableReasonService,
    private readonly tenantRepository: TenantRepository,
    private readonly dataProvidingEventsService: DataProvidingEventsService,
    private readonly appConfig: AppConfigService,
    private readonly salesForceCommandsService: SalesForceCommandsService,
  ) {}

  async upsert(userId: string, userData: SimpleUserDto): Promise<UserDto> {
    let user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new UserServiceErrors.UserAuthError({message: 'UserAuthError'});
    } else {
      try {
        user = new User({...user, ...userData});
        const savedUser = await this.userRepository.save(user);

        await this.dataProvidingEventsService.sendUserCreated(null, savedUser, savedUser.userProfile);
      } catch (err) {
        throw new UserServiceErrors.UserAuthError({message: 'UserAuthError'});
      }
    }

    return new UserDto(user);
  }

  async get(tenantId: number, userId: string, relations: string[] = []): Promise<UserDto> {
    const user = await this.userRepository.findOne(userId, relations);

    if (!user) {
      throw new UserServiceErrors.UserNotExists({message: 'UserFetchError'});
    }

    return new UserDto(user);
  }

  async findOneByEmail(email: string, relations: string[] = []): Promise<User> {
    return this.userRepository.findOneByEmail(email, relations);
  }

  async fetchMyColleagues(
    tenantId: number,
    userId: string,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    tenantUser: TenantUser,
  ): Promise<Pagination<any>> {
    try {
      const isAdmin = tenantUser.role.name === AuthRoles.admin;
      return await this.userRepository.fetchMyColleagues(
        tenantId,
        userId,
        tenantUser.user.clientId,
        tenantUser.user.client.countryId,
        isAdmin,
        paginatorOptions,
        sortingOptions,
        filteringOptions,
      );
    } catch (error) {
      throw new UserServiceErrors.UserFetchColleaguesError(null, error);
    }
  }

  async groupMyColleaguesByStatus(tenantId: number, userId: string, filteringOptions: FilteringOptions): Promise<any> {
    try {
      const tenantUser = await this.tenantUserRepository.findOne(tenantId, userId);
      const isAdmin = tenantUser.role.name === AuthRoles.admin;
      return await this.userRepository.groupMyColleaguesByStatus(
        tenantId,
        userId,
        tenantUser.user.clientId,
        isAdmin,
        filteringOptions,
      );
    } catch (error) {
      throw new UserServiceErrors.UserFetchColleaguesAggregateError(null, error);
    }
  }

  async createFromInfo(tenantId: number, userData: InfoCreateUserDto, sendIntegrationCommand = true): Promise<UserDto> {
    return this.createInternal(tenantId, userData, sendIntegrationCommand);
  }

  async createFromSalesForce(
    tenantId: number,
    userData: SalesForceCreateUserDto,
    sendIntegrationCommand = true,
  ): Promise<UserDto> {
    return this.createInternal(tenantId, userData, sendIntegrationCommand);
  }

  async create(tenantId: number, userData: CreateUserDto, sendIntegrationCommand = true): Promise<UserDto> {
    return this.createInternal(tenantId, userData, sendIntegrationCommand);
  }

  private async createInternal(tenantId: number, userData: any, sendIntegrationCommand = true): Promise<UserDto> {
    try {
      const uniquenessCheck = await this.userRepository.findOneByEmail(userData.personalInformation.email);
      if (uniquenessCheck !== undefined) {
        throw new UserServiceErrors.UserEmailAlreadyExists({email: userData.personalInformation.email});
      }

      const isValidDepartmentFunction = await this.departmentFunctionService.validateDepartmentFunction(
        tenantId,
        userData.personalInformation.department,
        userData.personalInformation.departmentFunction,
      );
      if (!isValidDepartmentFunction) {
        throw new UserServiceErrors.UserInconsistentDepartmentFunction({
          message: 'The selected Function is not valid for the selected Department',
        });
      }

      const user = new User();
      if (userData.userId) user.id = userData.userId;
      user.clientId = userData.personalInformation.clientId;
      user.email = userData.personalInformation.email;
      user.emailNotifications = false;

      if (!isNil(userData.inactive)) {
        user.inactive = userData.inactive;
      }

      const tenant = await this.tenantRepository.findOneWithRelations(tenantId);

      const status = await this.statusService.getStatusByName(tenantId, UserStatus.NotInvited, User.name);
      let role = await this.roleService.getRoleByName(AuthRoles.user);

      // event from SF can create admin user when we are creating that user
      if (userData.isAdmin) {
        role = await this.roleService.getRoleByName(AuthRoles.admin);
      }

      const permissions = userData.permissions;
      const locations = userData.locations;

      const [savedUser, savedUserProfile, savedTenantUser] = await getConnection().transaction(async (tManager) => {
        const userRepo = tManager.getCustomRepository(UserRepository);
        const profileRepo = tManager.getCustomRepository(UserProfileRepository);
        const tenantUserRepo = tManager.getCustomRepository(TenantUserRepository);

        const savedUser = await userRepo.save(user);

        const userProfileData = {
          id: savedUser.id,
          firstName: userData.personalInformation.firstName,
          lastName: userData.personalInformation.lastName,
          mainLocationId: userData.personalInformation.mainLocationId,
          title: userData.personalInformation.title,
          departmentId: userData.personalInformation.department,
          departmentFunctionId: userData.personalInformation.departmentFunction,
          customDepartment: userData.personalInformation.customDepartment,
          phonePrefix: userData.personalInformation.phonePrefix,
          phone: userData.personalInformation.phone,
          otherPhonePrefix: userData.personalInformation.otherPhonePrefix,
          otherPhone: userData.personalInformation.otherPhone,
          street: userData.personalInformation.street,
          street2: userData.personalInformation.street2,
          city: userData.personalInformation.city,
          state: userData.personalInformation.state,
          country: userData.personalInformation.country,
          zip: userData.personalInformation.zip,
          escalationTimesheetApprover: userData.personalInformation.escalationTimesheetApprover,
          billToInvoiceEmail: userData.personalInformation.billToInvoiceEmail,
          externalContactId: userData.personalInformation.externalContactId,
          language: userData.personalInformation.language
            ? userData.personalInformation.language
            : this.appConfig.defaultLanguageLocale,
        };

        const userProfile = new UserProfile(userProfileData);

        const savedUserProfile = await profileRepo.save(userProfile);

        const tenantUserData = new TenantUser({
          tenantId: tenantId,
          userId: savedUser.id,
          roleId: role.id,
          statusId: status.id,
          user: savedUser,
          role: role,
        });

        const savedTenantUser = await tenantUserRepo.save(tenantUserData);

        if (permissions?.length) {
          await this.createUserPermissions(tManager, tenantId, savedUser.id, permissions);
        }

        if (locations?.length) {
          await this.createUserLocations(tManager, tenantId, savedUser.id, locations);
        }

        return [savedUser, savedUserProfile, savedTenantUser];
      });

      if (sendIntegrationCommand) {
        this.logger.info(__filename, `UserService: Sending Integration Command Contact Created`);
        await this.infoSystemCommandsService.sendContactCreated(
          tenant,
          savedUser,
          savedUserProfile,
          userData.invitedByUserId,
        );

        const clientProfileRepository = getCustomRepository(ClientProfileRepository);
        const tenantUserPermissionRepository = getCustomRepository(TenantUserPermissionRepository);
        const tenantUserLocationRepository = getCustomRepository(TenantUserLocationRepository);

        const clientProfile = await clientProfileRepository.findOne(user.clientId);
        const userPermissionNames = await tenantUserPermissionRepository.getUserPermissionNames(
          tenant.id,
          user.id,
          permissions,
        );
        const externalLocationIds = await tenantUserLocationRepository.getUserExternalLocationIds(
          tenant.id,
          savedUser.id,
        );

        await this.salesForceCommandsService.sendContactCreated(tenant, savedUser, savedUserProfile, savedTenantUser, {
          clientProfile,
          permissionNames: userPermissionNames,
          externalLocationIds,
        });
      }

      await this.dataProvidingEventsService.sendUserCreated(tenantId, savedUser, savedUserProfile);
      await this.dataProvidingEventsService.sendTenantUserCreated(savedTenantUser);
      if (locations?.length) {
        await this.dataProvidingEventsService.sendTenantUserLocationCreated(tenantId, savedUser.id, locations);
      }

      return savedUser;
    } catch (error) {
      throw new UserServiceErrors.UserCreateError(null, error);
    }
  }

  async updateFromInfo(
    tenantId: number,
    userId: string,
    userData: InfoUpdateUserDto,
    sendIntegrationCommand = true,
  ): Promise<TenantUser> {
    return this.updateInternal(tenantId, userId, userData, sendIntegrationCommand);
  }

  async updateFromSalesForce(
    tenantId: number,
    userId: string,
    userData: SalesForceUpdateUserDto,
    sendIntegrationCommand = true,
  ): Promise<TenantUser> {
    return this.updateInternal(tenantId, userId, userData, sendIntegrationCommand);
  }

  async update(
    tenantId: number,
    userId: string,
    userData: UpdateUserDto,
    sendIntegrationCommand = true,
  ): Promise<TenantUser> {
    return this.updateInternal(tenantId, userId, userData, sendIntegrationCommand);
  }

  private async updateInternal(
    tenantId: number,
    userId: string,
    userData: any,
    sendIntegrationCommand = true,
  ): Promise<TenantUser> {
    try {
      const tenantUser = await this.tenantUserRepository.findOne(tenantId, userId);
      const tenantUserNotExists = !tenantUser;
      const tenant = await this.tenantRepository.findOneWithRelations(tenantId);
      let user = await this.userRepository.findOne(userId);

      const resTenantUser = await getConnection().transaction(async (tManager) => {
        const tenantUserRepo = tManager.getCustomRepository(TenantUserRepository);
        const profileRepo = tManager.getCustomRepository(UserProfileRepository);
        const userPermissionRepo = tManager.getCustomRepository(TenantUserPermissionRepository);
        const userLocationRepo = tManager.getCustomRepository(TenantUserLocationRepository);
        const userRepo = tManager.getCustomRepository(UserRepository);
        const clientProfileRepository = tManager.getCustomRepository(ClientProfileRepository);
        const tenantUserPermissionRepository = tManager.getCustomRepository(TenantUserPermissionRepository);
        const tenantUserLocationRepository = tManager.getCustomRepository(TenantUserLocationRepository);

        let tenantUser = await tenantUserRepo.findOne(tenantId, userId);
        if (!tenantUser) {
          const status = await this.statusService.getStatusByName(tenantId, UserStatus.Invited, User.name);
          const role = await this.roleService.getRoleByName(AuthRoles.user);

          if (userData.personalInformation.email && user.email !== userData.personalInformation.email) {
            if (user.B2CId) {
              throw new UserServiceErrors.UserEmailChangeForActiveUser({email: userData.personalInformation.email});
            }

            user.email = userData.personalInformation.email;
            await userRepo.save(user);
          }

          const tenantUserData = new TenantUser({
            tenantId,
            userId,
            roleId: role.id,
            statusId: status.id,
            role: role,
          });

          tenantUser = await tenantUserRepo.save(tenantUserData);
          await this.dataProvidingEventsService.sendTenantUserCreated(tenantUser);
        } else {
          const statusName = tenantUser.status.name;
          if (userData.personalInformation.email !== tenantUser.user.email) {
            if (
              statusName === UserStatus.Invited ||
              statusName === UserStatus.InvitationExpired ||
              statusName === UserStatus.InvitationFailure ||
              statusName === UserStatus.NotInvited
            ) {
              // change users email if we have some of requested user statuses
              tenantUser.user.email = userData.personalInformation.email;
              tenantUser.user = await userRepo.save(tenantUser.user);
            } else {
              await this.updateUserEmail(tenantId, tenantUser, userData.personalInformation);
            }
          }
        }

        const isValidDepartmentFunction = await this.departmentFunctionService.validateDepartmentFunction(
          tenantId,
          userData.personalInformation.department,
          userData.personalInformation.departmentFunction,
        );
        if (!isValidDepartmentFunction) {
          throw new UserServiceErrors.UserInconsistentDepartmentFunction({
            message: 'The selected Function is not valid for the selected Department',
          });
        }

        const userProfile = await profileRepo.findOne(userId);
        userProfile.firstName = userData.personalInformation.firstName;
        userProfile.lastName = userData.personalInformation.lastName;
        userProfile.mainLocationId = userData.personalInformation.mainLocationId;
        userProfile.title = userData.personalInformation.title;
        userProfile.departmentId = userData.personalInformation.department;
        userProfile.departmentFunctionId = userData.personalInformation.departmentFunction;
        userProfile.customDepartment = userData.personalInformation.customDepartment;
        userProfile.phonePrefix = userData.personalInformation.phonePrefix;
        userProfile.phone = userData.personalInformation.phone;
        userProfile.otherPhonePrefix = userData.personalInformation.otherPhonePrefix;
        userProfile.otherPhone = userData.personalInformation.otherPhone;

        if (userData.personalInformation.language) userProfile.language = userData.personalInformation.language;

        const savedUserProfile = await profileRepo.save(userProfile);

        if (savedUserProfile) tenantUser.user.userProfile = {...savedUserProfile};

        // put user to 'inactive' state
        if (![null, undefined].includes(userData?.personalInformation?.inactive)) {
          user.inactive = userData.personalInformation.inactive;
          user = await userRepo.save(user);
        }

        const permissions = userData.permissions;
        if (permissions?.length) {
          await userPermissionRepo.deleteAllUsersPermissions(tenantId, userId);
          tenantUser.tenantUserPermissions = await this.createUserPermissions(tManager, tenantId, userId, permissions);
        }

        const locations = userData.locations;
        if (locations?.length) {
          await userLocationRepo.deleteAllUsersLocations(tenantId, userId);
          tenantUser.tenantUserLocations = await this.createUserLocations(tManager, tenantId, userId, locations);
        }

        const cmdUser = tenantUser.user ? tenantUser.user : user;

        if (sendIntegrationCommand) {
          await this.infoSystemCommandsService.sendContactUpdated(tenant, cmdUser, savedUserProfile);

          const clientProfile = await clientProfileRepository.findOne(user.clientId);
          const userPermissionNames = await tenantUserPermissionRepository.getUserPermissionNames(
            tenant.id,
            user.id,
            permissions,
          );
          const externalLocationIds = await tenantUserLocationRepository.getUserExternalLocationIds(
            tenant.id,
            cmdUser.id,
          );

          await this.salesForceCommandsService.sendContactUpdated(tenant, cmdUser, savedUserProfile, tenantUser, {
            clientProfile,
            permissionNames: userPermissionNames,
            externalLocationIds,
          });
        }

        await this.dataProvidingEventsService.sendUserUpdated(tenantId, cmdUser, savedUserProfile);
        await this.dataProvidingEventsService.sendTenantUserLocationUpdated(tenantId, userId, locations);
        return tenantUser;
      });
      // TODO: need to check
      if (tenantUserNotExists) {
        await this.tenantUserInvitationService.create(
          tenantId,
          resTenantUser.userId,
          true,
          undefined,
          userData.invitedByUserId,
        );
      }
      if (sendIntegrationCommand) {
        await this.prepareUpdatePortalAccessCommand(tenantId, userId);
      }
      return resTenantUser;
    } catch (error) {
      throw new UserServiceErrors.UserCreateError(null, error);
    }
  }

  async disable(tenantId: number, userId: string, body: DisableUserDto): Promise<TenantUser> {
    try {
      // eslint-disable-next-line
      const {status, ...tenantUserObj} = await this.tenantUserRepository.findOne(tenantId, userId);
      const statusDisabled = await this.statusService.getStatusByName(tenantId, UserStatus.Disabled, User.name);
      tenantUserObj.statusId = statusDisabled.id;
      if (
        body.disableReason === DisableReasonEnum.LongBreak ||
        body.disableReason === DisableReasonEnum.NewPosition ||
        body.disableReason === DisableReasonEnum.NoLongerWorkInACompany
      ) {
        const disableReason: DisableReason = await this.disableReasonService.findOneByReason(body.disableReason);
        tenantUserObj.disableReason = disableReason;
        tenantUserObj.disableReasonId = disableReason.id;
      } else {
        const disableReason: DisableReason = await this.disableReasonService.findOneByReason(DisableReasonEnum.Other);
        tenantUserObj.disableReason = disableReason;
        tenantUserObj.disableReasonId = disableReason.id;
        tenantUserObj.otherDisableReason = body.disableReason;
      }
      const tenantUser = new TenantUser({
        tenantId: tenantUserObj.tenantId,
        userId: tenantUserObj.userId,
        statusId: tenantUserObj.statusId,
        disableReason: tenantUserObj.disableReason,
        disableReasonId: tenantUserObj.disableReasonId,
        otherDisableReason: tenantUserObj.otherDisableReason,
      });
      const savedTenantUser = await this.tenantUserRepository.save(tenantUser);

      // Disable old invitation link for the disabled user
      const oldInvitation = await this.tenantUserInvitationService.findLastOneByEmail(
        tenantId,
        userId,
        tenantUser.user.email,
      );
      if (oldInvitation?.isActive) {
        const updatedOldInvitation = new TenantUserInvitation({
          ...oldInvitation,
          isActive: false,
        });
        await this.tenantUserInvitationService.update(updatedOldInvitation);
      }

      // Trigger notifications to the admin only if the user disabled his account from CLP
      if (body.origin && body.origin === DisableUserOrigin.CLP_USER) {
        await this.sendAccountDisabledAdminsEmailNotification(savedTenantUser);
      }

      this.prepareUpdatePortalAccessCommand(tenantId, userId);

      return savedTenantUser;
    } catch (error) {
      throw new UserServiceErrors.UserDisableError(null, error);
    }
  }

  async enable(tenantId: number, userId: string, body: EnableUserDto): Promise<TenantUserInvitationDto> {
    try {
      const tenantUserInvitation = await this.tenantUserInvitationService.create(
        tenantId,
        userId,
        false,
        undefined,
        body.enabledByUserId,
      );

      await this.prepareUpdatePortalAccessCommand(tenantId, userId);

      return tenantUserInvitation;
    } catch (error) {
      throw new UserServiceErrors.UserDisableError(null, error);
    }
  }

  async findUsersWithPermission(
    tenantId: number,
    permission: string,
    locationId: string,
    hasNotificationEnabled?: boolean,
  ): Promise<UserDto[]> {
    const users = await this.userRepository.fetchUsersWithPermission(
      tenantId,
      permission,
      locationId,
      hasNotificationEnabled,
    );
    return users.map((user) => new UserDto(user));
  }

  private createUserPermissions = async (tManager, tenantId: number, userId: string, permissions: string[]) => {
    const userPermissionRepo = tManager.getCustomRepository(TenantUserPermissionRepository);
    const createdUserPermissions = permissions.map((permission) => {
      const userPermissionData = {
        tenantId,
        userId,
        permissionId: permission,
      };
      const userPermission = new TenantUserPermission(userPermissionData);
      return userPermissionRepo.save(userPermission);
    });
    return await Promise.all(createdUserPermissions);
  };

  private createUserLocations = async (tManager, tenantId: number, userId: string, locations: string[]) => {
    const userLocationRepo = tManager.getCustomRepository(TenantUserLocationRepository);
    const createdUserLocations = locations.map((location) => {
      const userLocationData = {
        tenantId: tenantId,
        userId: userId,
        locationId: location,
      };
      const userLocation = new TenantUserLocation(userLocationData);
      return userLocationRepo.save(userLocation);
    });
    return await Promise.all(createdUserLocations);
  };

  private updateUserEmail = async (
    tenantId: number,
    tenantUser: TenantUser,
    newPersonalInformation: UpdateUserPersonalInformationDto,
  ) => {
    const {user} = tenantUser;
    const email = newPersonalInformation.email;
    const existingUser = await this.userRepository.findOne(tenantUser.userId);

    //There is impossible to change email if user is registered (has B2CId)
    if (existingUser.B2CId) {
      throw new UserServiceErrors.UserEmailChangeForActiveUser({email: email});
    }

    //update b3c..
    const updatedUser = new User({
      id: user.id,
      B2CId: null,
      email,
    });
    await this.userRepository.save(updatedUser);
    const userProfileToUpdate = new UserProfile({
      id: user.id,
      ...user.userProfile,
    });
    await this.userProfileRepository.save(userProfileToUpdate);

    if (tenantUser.status.name == UserStatus.Invited) {
      const oldInvitation = await this.tenantUserInvitationService.findLastOneByEmail(tenantId, user.id, user.email);
      if (oldInvitation.isActive) {
        const updatedOldInvitation = new TenantUserInvitation({
          ...oldInvitation,
          isActive: false,
        });
        await this.tenantUserInvitationService.update(updatedOldInvitation);
      }
      await this.tenantUserInvitationService.create(tenantId, user.id);
    }
  };

  public prepareUpdatePortalAccessCommand = async (tenantId: number, userId: string) => {
    const tenant = await this.tenantRepository.findOneWithRelations(tenantId);
    const tenantUser = await this.tenantUserRepository.findOne(tenantId, userId);
    const locations = await this.tenantUserLocationService.getUserLocations(tenantId, tenantUser.userId);
    const permissions = await this.tenantUserPermissionService.getUserPermissions(tenantId, tenantUser.userId);

    if (!tenant || !tenantUser || !locations || !permissions) {
      throw new UserServiceErrors.UserPrepareUpdatePortalAccessCommandError(null);
    }

    this.infoSystemCommandsService.sendPortalAccessUpdated(tenantUser.user, locations, permissions, tenantUser, tenant);
  };

  async fetchAllUsersFirstAndLastNames(clientId: string): Promise<any[]> {
    return this.userRepository.getAllUserFirstAndLastNameDistinct(clientId);
  }

  /**
   * Send notification emails to all of the Admins of the Tenant associated with the disabled User
   *
   * @param {TenantUser} tenantUser - The disabled User
   * @returns {Promise<void[]>} - Simple promise to ensure that all af the actions are dispatched successfully to the email queue
   */
  private sendAccountDisabledAdminsEmailNotification = async (tenantUser: TenantUser): Promise<void[]> => {
    const {
      user: {
        userProfile: {title, firstName, lastName, mainLocation, department, departmentFunction},
      },
      disableReason,
      otherDisableReason,
    } = tenantUser;
    const hostName = UtilsHelper.getHostName(this.appConfig);

    // Loop through all of the admins associated with the current tenant and send them a notification email
    const allTenantAdmins: TenantUser[] = await this.getAllTenantAdmins(tenantUser.tenantId);
    const allAdminNotifications = allTenantAdmins.map((admin) => {
      if (admin.user.emailNotifications) {
        const accountDisabledAdminsNotification: AccountDisabledAdminsNotification = {
          tenantId: admin.tenantId,
          email: admin.user.email,
          adminFirstName: admin.user.userProfile.firstName,
          userFullName: `${firstName} ${lastName}`,
          userLocation: mainLocation.locationName,
          userTitle: title,
          userDepartment: department.name,
          userFunction: departmentFunction.name,
          userDisableReason:
            disableReason.reason === DisableReasonEnum.Other ? otherDisableReason : disableReason.reason,
          myColleaguesUrl: `${hostName}/client/my-colleagues`,
        };

        return this.notify.emailAccountDisabledAdmins(accountDisabledAdminsNotification);
      }
    });

    return Promise.all(allAdminNotifications);
  };

  /**
   * Get all Admins which belongs to a specific Tenant
   *
   * @param {number} tenantId - Filter the users based on the provided Tenant ID
   * @returns {Promise<TenantUser[]>} - List with all admin Users associated with the provided Tenant
   */
  public getAllTenantAdmins = async (tenantId: number): Promise<TenantUser[]> => {
    const users = await this.tenantUserRepository.findAllByTenant(tenantId);
    const admins = users.filter((user) => user.role.name === AuthRoles.admin);

    return admins;
  };
}
