import {TenantUser} from './../../../tenantUser/tenantUser.entity';
import {UserProfileService} from './../../../userProfile/userProfile.service';
import {IntegrationLogs} from './../../integrationLogging.service';
import {PermissionScopes} from 'src/core/permission/permissionScopes';
import {PermissionService} from './../../../permission/permission.service';
import {SalesForceCreateUserDto} from './../../../user/dto/salesForceCreateUser.dto';
import {ClientProfileService} from './../../../clientProfile/clientProfile.service';
import {TenantService} from 'src/modules/tenant/tenant.service';
import {Injectable} from '@nestjs/common';
import {ContactCreatedData, SalesForceEvent} from '../eventModels';
import {CommonIntegrationError} from '../../commonIntegration.error';
import {SalesForceError} from '../salesForce.error';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {UserService} from 'src/modules/user/user.service';
import {UserStatus} from '../eventModels/salesForceStatuses.enum';
import {mapSalesForcePermissions} from '../lib/permissionMapping';
import {IntegrationSystemLogType} from '../../integrationSystem.enum';
import {ContactUpdatedData} from '../eventModels/contactUpdatedData';
import {SalesForceUpdateUserDto} from 'src/modules/user/dto/salesForceUpdateUser.dto';
import {ClientAdminInvitedData} from '../eventModels/clientAdminInvitedData';
import {TenantUserRepository} from 'src/modules/tenantUser/tenantUser.repository';
import {DataProvidingEventsService} from '../../dataProviding/dataProvidingEvents.service';
import {TransformationsService} from 'src/modules/transformations/transformation.service';
import {EC_Transformations} from 'src/modules/transformations/eventsAndCommandsTransformations.data';
import {TenantUserInvitationService} from 'src/modules/tenantUserInvitation/tenantUserInvitation.service';
import {BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';

@Injectable()
export class UserEventsService {
  public constructor(
    private readonly tenantService: TenantService,
    private readonly userService: UserService,
    private readonly userProfileService: UserProfileService,
    private readonly permissionService: PermissionService,
    private readonly clientProfileService: ClientProfileService,
    private readonly integrationLogs: IntegrationLogs,
    private readonly tenantUserRepository: TenantUserRepository,
    private readonly dataProvidingEventsService: DataProvidingEventsService,
    private readonly transformationsService: TransformationsService,
    private readonly tenantUserInvitationService: TenantUserInvitationService,
  ) {}

  public async onContactCreated(event: SalesForceEvent<ContactCreatedData>) {
    const {eventId, brand, country, parameters} = event;

    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      'Contact Created',
    );

    if (!eventId) {
      throw new CommonIntegrationError.EventIdNotProvided();
    }

    const tenant = await this.tenantService.getByBrandAndCountry(brand, country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    if (!parameters?.externalCustomerId) {
      throw new SalesForceError.CustomerNotSpecified();
    }

    const clientProfile = await this.clientProfileService.getByExternalCustomerId(parameters.externalCustomerId);
    if (!clientProfile || !clientProfile?.client) {
      throw new SalesForceError.CustomerNotFound();
    }
    const clientId = clientProfile.client.id;

    if (tenant.countryId !== clientProfile.client.countryId) {
      throw new CommonIntegrationError.CountryNotMatchingLocationCountry();
    }

    const availableSalesForcePermissions = await this.permissionService.getPermissionsByName(
      tenant.id,
      PermissionScopes.getSalesForcePermissionNames(),
    );

    const permissions = await mapSalesForcePermissions(parameters.permission, availableSalesForcePermissions);

    this.integrationLogs.mappedPermissions(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      permissions?.permissionNames,
    );

    const userData: SalesForceCreateUserDto = {
      userId: UtilsHelper.dbUuid(),
      personalInformation: {
        firstName: parameters.firstName,
        lastName: parameters.lastName,
        phone: parameters.phone,
        otherPhone: parameters.otherPhone,
        email: parameters.email,
        street: parameters.street,
        street2: parameters.street2,
        city: parameters.city,
        state: parameters.state,
        country: parameters.country,
        zip: parameters.zip,
        escalationTimesheetApprover: parameters.escalationTimesheetApprover,
        billToInvoiceEmail: parameters.billToInvoiceEmail,
        externalContactId: parameters.externalContactId,
        customDepartment: parameters.departmentText,
        title: parameters.title,
        clientId,
      },
      inactive: parameters.statusSF === UserStatus.Inactive,
      permissions: permissions.permissionIds,
      isAdmin: false,
    };

    await this.userService.createFromSalesForce(tenant.id, userData, false);
  }

  public async onContactUpdated(event: SalesForceEvent<ContactUpdatedData>) {
    const {eventId, brand, country, parameters} = event;

    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      'Contact Updated',
    );

    if (!eventId) {
      throw new CommonIntegrationError.EventIdNotProvided();
    }

    const tenant = await this.tenantService.getByBrandAndCountry(brand, country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    if (!parameters?.externalCustomerId) {
      throw new SalesForceError.CustomerNotSpecified();
    }

    if (!parameters?.externalContactId) {
      throw new SalesForceError.ContactNotSpecified();
    }
    const userProfile = await this.userProfileService.findByExternalContactId(parameters.externalContactId);

    const clientProfile = await this.clientProfileService.getByExternalCustomerId(parameters.externalCustomerId);
    if (!clientProfile || !clientProfile?.client) {
      throw new SalesForceError.CustomerNotFound();
    }
    const clientId = clientProfile.client.id;

    if (tenant.countryId !== clientProfile.client.countryId) {
      throw new CommonIntegrationError.CountryNotMatchingLocationCountry();
    }

    const availableSalesForcePermissions = await this.permissionService.getPermissionsByName(
      tenant.id,
      PermissionScopes.getSalesForcePermissionNames(),
    );

    const newUserPermissions = await mapSalesForcePermissions(parameters.permission, availableSalesForcePermissions);

    this.integrationLogs.mappedPermissions(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      newUserPermissions?.permissionNames,
    );

    const userData: SalesForceUpdateUserDto = {
      userId: userProfile.id,
      personalInformation: {
        firstName: parameters.firstName,
        lastName: parameters.lastName,
        phone: parameters.phone,
        otherPhone: parameters.otherPhone,
        email: parameters.email,
        street: parameters.street,
        street2: parameters.street2,
        city: parameters.city,
        state: parameters.state,
        country: parameters?.countryCode,
        zip: parameters.zip,
        escalationTimesheetApprover: parameters.escalationTimesheetApprover,
        billToInvoiceEmail: parameters.billToInvoiceEmail,
        customDepartment: parameters.departmentText,
        title: parameters.title,
        clientId,
        externalContactId: parameters.externalContactId,
        inactive: parameters.statusSF === UserStatus.Inactive,
      },
      permissions: newUserPermissions.permissionIds,
      isAdmin: parameters.role === 'Admin',
    };

    await this.userService.updateFromSalesForce(tenant.id, userProfile.id, userData, false);
  }

  public async onClientAdminInvited(event: SalesForceEvent<ClientAdminInvitedData>) {
    const {brand, country, parameters} = event;
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      'Invite Client Admin',
      event,
    );

    const tenant = await this.tenantService.getByBrandAndCountry(brand, country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const userProfile = await this.userProfileService.findByExternalContactId(parameters.externalContactId);
    if (!userProfile) {
      throw new CommonIntegrationError.UserNotFound();
    }

    event.keyValues = {brand, country, stage: parameters.status, role: parameters.role};
    const transformedEvent = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.clientAdminInvited,
      event,
      BusMessageTypeEnum.EVENT,
    );

    const tenantUser = await this.tenantUserRepository.findOne(tenant.id, userProfile.id);
    if (!tenantUser) {
      const tenantUserData = new TenantUser({
        userId: userProfile.id,
        tenantId: tenant.id,
        roleId: transformedEvent.parameters.role,
        statusId: transformedEvent.parameters.status,
      });
      const savedTenantUser = await this.tenantUserRepository.save(tenantUserData);
      await this.dataProvidingEventsService.sendTenantUserCreated(savedTenantUser);
    }

    await this.tenantUserInvitationService.create(tenant.id, userProfile.id, false, transformedEvent.parameters.role);
  }
}
