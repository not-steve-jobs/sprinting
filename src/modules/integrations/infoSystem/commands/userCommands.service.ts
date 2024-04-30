import {Tenant} from './../../../tenant/tenant.entity';
import {InfoSystemCommand} from './../infoSystemIntegrationTypes';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {v4 as uuid} from 'uuid';
import {User} from '../../../user/user.entity';
import {UserProfile} from '../../../userProfile/userProfile.entity';
import {CountryService} from '../../../country/country.service';
import {TenantUser} from '../../../tenantUser/tenantUser.entity';
import {BusMessage} from '../../../busMessage/busMessage.entity';
import {TenantService} from '../../../tenant/tenant.service';
import {UserService} from '../../../user/user.service';
import {TenantUserInvitationService} from '../../../tenantUserInvitation/tenantUserInvitation.service';
import {TenantUserRepository} from '../../../tenantUser/tenantUser.repository';
import {UserStatus} from '../../../status/status.enum';
import {StatusService} from '../../../status/status.service';
import {MessageRecordType} from '../eventModels';
import {CommonIntegrationError} from '../../commonIntegration.error';
import {IntegrationLogs} from '../../integrationLogging.service';
import {IntegrationSystemLogType, LogMessageType, ProcessingPlace} from '../../integrationSystem.enum';

@Injectable()
export class UserCommandsService {
  constructor(
    private readonly countryService: CountryService,
    private readonly tenantService: TenantService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => TenantUserInvitationService))
    private readonly tenantUserInvitationService: TenantUserInvitationService,
    private readonly tenantUserRepository: TenantUserRepository,
    private readonly statusService: StatusService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async getContactCommand(
    commandName: string,
    tenant: Tenant,
    user: User,
    userProfile: UserProfile,
    invitedByUserId: string = null,
  ): Promise<InfoSystemCommand> {
    const countryPhonePrefix =
      userProfile && userProfile.phonePrefix
        ? await this.countryService.findOneByCallingCode(userProfile.phonePrefix)
        : null;
    const countryOtherPhonePrefix =
      userProfile && userProfile.otherPhonePrefix
        ? await this.countryService.findOneByCallingCode(userProfile.otherPhonePrefix)
        : null;
    return {
      commandName: commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        contactRecordType: MessageRecordType.Client,
        userId: user.id,
        mainLocation: userProfile.mainLocationId,
        email: user.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        deptFunctionId: userProfile.departmentFunctionId,
        deptId: userProfile.departmentId,
        customDepartment: userProfile.customDepartment,
        title: userProfile.title,
        phone: userProfile.phone,
        phonePrefix: countryPhonePrefix ? `${countryPhonePrefix.name} +${userProfile.phonePrefix}` : null,
        otherPhone: userProfile.otherPhone,
        phonePrefixOtherPhone: countryOtherPhonePrefix
          ? `${countryOtherPhonePrefix.name} +${userProfile.otherPhonePrefix}`
          : null,
        // notification: user.emailNotifications,
        invitedByUserId: invitedByUserId ?? null,
        language: userProfile.language,
      },
    };
  }

  public getCreatePortalAccessCommand(
    commandName: string,
    user: User,
    userLocations: string[],
    userPermissions: string[],
    tenantUser?: TenantUser,
    tenant?: Tenant,
  ): InfoSystemCommand {
    return {
      commandName: commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        contactRecordType: MessageRecordType.Client,
        userId: user.id,
        locationId: userLocations,
        permissionId: userPermissions,
        roleId: tenantUser ? tenantUser.roleId : user.tenantUsers[0].roleId,
        statusId: tenantUser ? tenantUser.statusId : user.tenantUsers[0].statusId,
      },
    };
  }

  public getUpdatePortalAccessCommand(
    commandName: string,
    user: User,
    userLocations: string[],
    userPermissions: string[],
    tenantUser?: TenantUser,
    tenant?: Tenant,
  ): InfoSystemCommand {
    const disableReasonId = tenantUser ? tenantUser.disableReasonId : user.tenantUsers[0].disableReasonId;
    return {
      commandName: commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        contactRecordType: MessageRecordType.Client,
        userId: user.id,
        locationId: userLocations,
        permissionId: userPermissions,
        statusId: tenantUser ? tenantUser.statusId : user.tenantUsers[0].statusId,
        disableReasonId: disableReasonId ?? 0,
        disableReasonOther: tenantUser ? tenantUser.otherDisableReason : user.tenantUsers[0].otherDisableReason,
      },
    };
  }

  public async onCreateContactSuccess(busMessage: BusMessage) {
    this.integrationLogs.commandResponseEvent(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      LogMessageType.SuccessEvent,
      busMessage.messageName,
      busMessage,
    );
    const commandData = busMessage.payload;

    const tenant = await this.tenantService.getByBrandAndCountry(commandData.body.brand, commandData.body.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const user = await this.userService.get(tenant.id, commandData.body.parameters.userId);
    if (!user) {
      throw new CommonIntegrationError.UserNotFound();
    }

    this.integrationLogs.generalInfoLog(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      LogMessageType.Unknown,
      ProcessingPlace.CommandSuccessHandler,
      'Create user invitation',
    );
    await this.tenantUserInvitationService.create(
      tenant.id,
      user.id,
      true,
      undefined,
      commandData.body.parameters?.invitedByUserId,
    );
  }

  public async onCreateContactError(busMessage: BusMessage) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Contact Created - Error',
      busMessage,
    );
    const commandData = busMessage.payload;

    const tenant = await this.tenantService.getByBrandAndCountry(commandData.body.brand, commandData.body.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const tenantUser = await this.tenantUserRepository.findOne(tenant.id, commandData.body.parameters.userId);
    if (!tenantUser) {
      throw new CommonIntegrationError.UserCountryBrandNotFound();
    }

    const status = await this.statusService.getStatusByName(tenant.id, UserStatus.CreationFailure, User.name);

    tenantUser.statusId = status.id;
    this.integrationLogs.generalInfoLog(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      LogMessageType.Command,
      ProcessingPlace.CommandErrorHandler,
      'Persisting contact creation error',
    );
    await this.tenantUserRepository.save(
      new TenantUser({tenantId: tenant.id, userId: tenantUser.userId, statusId: status.id}),
    );
  }
}
