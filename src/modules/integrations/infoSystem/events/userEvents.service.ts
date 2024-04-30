import {IntegrationLogs} from './../../integrationLogging.service';
import {CommonIntegrationError} from '../../commonIntegration.error';
import {Injectable} from '@nestjs/common';
import {
  ClientAdminInvitedData,
  ContactCreatedData,
  ContactUpdatedData,
  InfoSystemEvent,
  PortalAccessUpdatedData,
} from '../eventModels';
import {LocationService} from '../../../location/location.service';
import {TenantService} from '../../../tenant/tenant.service';
import {UserService} from '../../../user/user.service';
import {TenantUserRepository} from '../../../tenantUser/tenantUser.repository';
import {TenantUser} from '../../../tenantUser/tenantUser.entity';
import {DataProvidingEventsService} from '../../dataProviding/dataProvidingEvents.service';
import {TenantUserInvitationService} from '../../../tenantUserInvitation/tenantUserInvitation.service';
import {InfoCreateUserDto} from 'src/modules/user/dto/infoCreateUser.dto';
import {InfoUpdateUserDto} from 'src/modules/user/dto/infoUpdateUser.dto';
import {RoleService} from 'src/modules/role/role.service';
import {AuthRoles} from 'src/core/auth/authRoles';
import {RoleChangeToAdminNotification} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/roleChangeToAdminNotification.interface';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {BackgroundNotificationService} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotification.service';
import {RoleChangeToUserNotification} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/roleChangeToUserNotification.interface';
import {SetupUserPermissionsNotification} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/setupUserPermissionsNotification.interface';
import {NotificationEntityName, NotificationTypeEnum} from 'src/modules/notification/notification.enum';
import {Notification} from 'src/modules/notification/notification.entity';
import {NotificationService} from 'src/modules/notification/notification.service';
import {IntegrationSystemLogType} from '../../integrationSystem.enum';

@Injectable()
export class UserEventsService {
  public constructor(
    private readonly notify: BackgroundNotificationService,
    private readonly appConfig: AppConfigService,
    private readonly locationService: LocationService,
    private readonly tenantService: TenantService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly tenantUserRepository: TenantUserRepository,
    private readonly dataProvidingEventsService: DataProvidingEventsService,
    private readonly tenantUserInvitationService: TenantUserInvitationService,
    private readonly notificationService: NotificationService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async onContactCreated(event: InfoSystemEvent<ContactCreatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Contact Created',
      event,
    );

    if (!event.eventId) {
      throw new CommonIntegrationError.EventIdNotProvided();
    }

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const location = await this.locationService.findOneWithClient(event.parameters.mainLocation);
    if (!location) {
      throw new CommonIntegrationError.LocationNotFound();
    }

    if (tenant.countryId !== location.client.countryId) {
      throw new CommonIntegrationError.CountryNotMatchingLocationCountry();
    }

    const contactData: InfoCreateUserDto = {
      userId: event.parameters.userId,
      personalInformation: {
        email: event.parameters.email ? event.parameters.email : null,
        firstName: event.parameters.firstName ? event.parameters.firstName : null,
        lastName: event.parameters.lastName ? event.parameters.lastName : null,
        department: event.parameters.deptId ? event.parameters.deptId : null,
        departmentFunction: event.parameters.deptFunctionId ? event.parameters.deptFunctionId : null,
        customDepartment: event.parameters.customDepartment ? event.parameters.customDepartment : null,
        language: event.parameters.language ? event.parameters.language : null,
        title: event.parameters.title ? event.parameters.title : null,
        mainLocationId: event.parameters.mainLocation,
        clientId: location.clientId,
        phone: event.parameters.phone ? event.parameters.phone : null,
        phonePrefix: event.parameters.phonePrefix ? event.parameters.phonePrefix.replace(/\D/g, '') : null,
        otherPhone: event?.parameters?.otherPhone,
        otherPhonePrefix: event.parameters.phonePrefixOtherPhone
          ? event.parameters.phonePrefixOtherPhone.replace(/\D/g, '')
          : null,
      },
    };

    await this.userService.createFromInfo(tenant.id, contactData, false);
  }

  public async onContactUpdated(event: InfoSystemEvent<ContactUpdatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Contact Updated',
      event,
    );

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const location = await this.locationService.findOne(event.parameters.mainLocation);
    if (!location) {
      throw new CommonIntegrationError.LocationNotFound();
    }

    const contactData: InfoUpdateUserDto = {
      userId: event.parameters.userId,
      personalInformation: {
        email: event.parameters.email,
        firstName: event.parameters.firstName,
        lastName: event.parameters.lastName,
        department: event.parameters.deptId,
        departmentFunction: event.parameters.deptFunctionId,
        customDepartment: event.parameters.customDepartment,
        title: event.parameters.title,
        mainLocationId: event.parameters.mainLocation,
        language: event.parameters.language ? event.parameters.language : null,
        clientId: location.clientId,
        phone: event.parameters.phone,
        phonePrefix: event.parameters.phonePrefix ? event.parameters.phonePrefix.replace(/\D/g, '') : null,
        otherPhone: event.parameters.otherPhone,
        otherPhonePrefix: event.parameters.phonePrefixOtherPhone
          ? event.parameters.phonePrefixOtherPhone.replace(/\D/g, '')
          : null,
        inactive: event.parameters.inactive ?? null,
      },
    };

    await this.userService.updateFromInfo(tenant.id, event.parameters.userId, contactData, false); // TODO
  }

  public async onClientAdminInvited(event: InfoSystemEvent<ClientAdminInvitedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Invite Client Admin',
      event,
    );

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const user = await UtilsHelper.retry(async () => this.userService.get(tenant.id, event.parameters.userId), 3, 1000);
    if (!user) {
      throw new CommonIntegrationError.UserNotFound();
    }

    const tenantUser = await this.tenantUserRepository.findOne(tenant.id, event.parameters.userId);

    if (!tenantUser) {
      const tenantUserData = new TenantUser({
        userId: event.parameters.userId,
        tenantId: tenant.id,
        roleId: event.parameters.roleId,
        statusId: event.parameters.statusId,
      });
      const savedTenantUser = await this.tenantUserRepository.save(tenantUserData);
      await this.dataProvidingEventsService.sendTenantUserCreated(savedTenantUser);
    }

    await this.tenantUserInvitationService.create(tenant.id, event.parameters.userId, false, event.parameters.roleId);
  }

  public async onPortalAccessUpdated(event: InfoSystemEvent<PortalAccessUpdatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Update Portal Access',
      event,
    );

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const tenantUser = await this.tenantUserRepository.findOne(tenant.id, event.parameters.userId);
    if (!tenantUser) {
      throw new CommonIntegrationError.UserCountryBrandNotFound();
    }

    if (tenantUser) {
      const tenantUserData = new TenantUser({
        userId: event.parameters.userId,
        tenantId: tenant.id,
        roleId: event.parameters.roleId,
        statusId: event.parameters.statusId,
      });

      if (event.parameters.retryInvitation) {
        await this.tenantUserInvitationService.create(tenant.id, tenantUser.userId, false, event.parameters.roleId);
      } else {
        if (event.parameters.disableReasonId !== 0) {
          tenantUserData.disableReasonId = event.parameters.disableReasonId;
        }

        const savedTenantUser = await this.tenantUserRepository.save(tenantUserData);
        await this.dataProvidingEventsService.sendTenantUserUpdated(savedTenantUser);
        await this.sendRoleChangeNotifications(tenantUser, savedTenantUser.roleId);
        await this.sendSetupUserPermissionsNotifications(tenantUser, savedTenantUser.roleId);
      }
    }
  }

  /**
   * Send notifications to the user to notify him for his new role
   * Includes simple bell notification in CLP and email notifications
   *
   * @param {TenantUser} tenantUser - The User which role was changed
   * @param {number} roleId - The new Role of the User
   * @returns {Promise<void>} - Simple promise to ensure that actions are dispatched successfully
   */
  private sendRoleChangeNotifications = async (tenantUser: TenantUser, roleId: number): Promise<void> => {
    await this.sendRoleChangeEmailNotification(tenantUser, roleId);
    await this.sendRoleChangeNotification(tenantUser, roleId);
  };

  /**
   * Send a notification to the user to notify him for his new role
   *
   * @param {TenantUser} tenantUser - The User which role was changed
   * @param {number} roleId - The new Role of the User
   * @returns {Promise<void>} - Simple promise to ensure that action is dispatched successfully
   */
  private sendRoleChangeNotification = async (tenantUser: TenantUser, roleId: number): Promise<void> => {
    const {userId, tenantId, roleId: oldRoleId} = tenantUser;
    const role = await this.roleService.getRoleById(roleId);

    if (roleId !== oldRoleId) {
      const newNotificationData: Partial<Notification> = {
        tenantId,
        userId,
        isRead: false,
      };

      if (role.name === AuthRoles.admin) {
        newNotificationData.type = NotificationTypeEnum.RoleChangeToAdmin;
      } else if (role.name === AuthRoles.user) {
        newNotificationData.type = NotificationTypeEnum.RoleChangeToUser;
      }

      const newNotification = new Notification(newNotificationData);
      this.notificationService.save(newNotification);
    }
  };

  /**
   * Send an email notification to the user to notify him for his new role
   * NOTE: Alex suggested to export this method to a separate service
   * for shared usage across the codebase in the future
   *
   * @param {TenantUser} tenantUser - The User which role was changed
   * @param {number} roleId - The new Role of the User
   * @returns {Promise<void>} - Simple promise to ensure that action is dispatched successfully to the email queue
   */
  private sendRoleChangeEmailNotification = async (tenantUser: TenantUser, roleId: number): Promise<void> => {
    const {
      user: {
        email,
        emailNotifications,
        userProfile: {firstName},
      },
      roleId: oldRoleId,
      tenantId,
    } = tenantUser;
    const role = await this.roleService.getRoleById(roleId);
    const hostName = UtilsHelper.getHostName(this.appConfig);

    if (emailNotifications && roleId !== oldRoleId) {
      // Note: For now both of the templates share the same set of params
      // but at some point they may start to differ so I prefer to have a separate interfaces
      const roleChangeNotification: RoleChangeToAdminNotification | RoleChangeToUserNotification = {
        tenantId,
        email,
        firstName,
        link: hostName,
      };

      if (role.name === AuthRoles.admin) {
        await this.notify.emailRoleChangeToAdmin(roleChangeNotification);
      } else if (role.name === AuthRoles.user) {
        await this.notify.emailRoleChangeToUser(roleChangeNotification);
      }
    }
  };

  /**
   * Send notifications to the admins of a user whose role was changed to notify them for this change
   * Includes simple bell notification in CLP and email notifications
   *
   * @param {TenantUser} tenantUser - The User which role was changed
   * @param {number} roleId - The new Role of the User
   * @returns {Promise<void[]>} - Simple promise to ensure that actions are dispatched successfully
   */
  private sendSetupUserPermissionsNotifications = async (tenantUser: TenantUser, roleId: number): Promise<void[]> => {
    const role = await this.roleService.getRoleById(roleId);

    if (role.name === AuthRoles.user) {
      // Loop through all of the admins associated with the current tenant and send them a notification email
      const allTenantAdmins: TenantUser[] = await this.userService.getAllTenantAdmins(tenantUser.tenantId);

      return Promise.all(
        allTenantAdmins.map(async (admin) => {
          await this.sendSetupUserPermissionsNotification(admin, tenantUser);
          await this.sendSetupUserPermissionsEmailNotification(admin, tenantUser);
        }),
      );
    }
  };

  /**
   * Send a simple bell notification in CLP to the admin related with the tenant of the user which
   * role was changed in order to notify him that he has to apply a new set of permissions
   *
   * @param {TenantUser} admin - The Admin which should be notified
   * @param {TenantUser} tenantUser - The User which role was changed
   * @returns {Promise<void>} - Simple promise to ensure that actions were dispatched successfully to the email queue
   */
  private sendSetupUserPermissionsNotification = async (
    admin: TenantUser,
    tenantUser: TenantUser,
  ): Promise<Notification> => {
    const newNotification = new Notification({
      tenantId: admin.tenantId,
      userId: admin.userId,
      entityId: tenantUser.userId,
      entityName: NotificationEntityName.User,
      type: NotificationTypeEnum.SetupUserPermissions,
      isRead: false,
    });

    return this.notificationService.save(newNotification);
  };

  /**
   * Send an email notification to the admin related with the tenant of the user which
   * role was changed in order to notify him that he has to apply a new set of permissions
   *
   * @param {TenantUser} admin - The Admin which should be notified
   * @param {TenantUser} tenantUser - The User which role was changed
   * @returns {Promise<void>} - Simple promise to ensure that actions were dispatched successfully to the email queue
   */
  private sendSetupUserPermissionsEmailNotification = async (
    admin: TenantUser,
    tenantUser: TenantUser,
  ): Promise<void> => {
    const {
      user: {
        userProfile: {firstName, lastName},
      },
      tenantId,
    } = tenantUser;
    const hostName = UtilsHelper.getHostName(this.appConfig);

    if (admin.user.emailNotifications) {
      const setupUserPermissionsNotification: SetupUserPermissionsNotification = {
        tenantId,
        email: admin.user.email,
        adminFirstName: admin.user.userProfile.firstName,
        userFullName: `${firstName} ${lastName}`,
        link: `${hostName}/client/my-colleagues`,
      };

      await this.notify.emailSetupUserPermissions(setupUserPermissionsNotification);
    }

    return Promise.resolve();
  };
}
