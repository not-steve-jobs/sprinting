import {BusMessage} from './../../../busMessage/busMessage.entity';
import {SalesForceCommands, SalesForceCommand} from './../salesForceIntegrationTypes';
import {Tenant} from './../../../tenant/tenant.entity';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {v4 as uuid} from 'uuid';
import {User} from '../../../user/user.entity';
import {UserProfile} from '../../../userProfile/userProfile.entity';
import {TenantService} from '../../../tenant/tenant.service';
import {UserService} from '../../../user/user.service';
import {TenantUserInvitationService} from '../../../tenantUserInvitation/tenantUserInvitation.service';
import {TenantUserRepository} from '../../../tenantUser/tenantUser.repository';
import {StatusService} from '../../../status/status.service';
import {UserStatus as SalesForceUserStatus} from '../eventModels/salesForceStatuses.enum';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {mapUserPermissions} from '../lib/permissionMapping';
import {CreateContactAdditionalData} from '../commandModels/contactData';
import {CommonIntegrationError} from '../../commonIntegration.error';
import {IntegrationSystemLogType, LogMessageType, ProcessingPlace} from '../../integrationSystem.enum';
import {SalesForceError} from '../salesForce.error';
import {UserStatus} from 'src/modules/status/status.enum';
import {UserProfileRepository} from 'src/modules/userProfile/userProfile.repository';
import {IntegrationLogs} from '../../integrationLogging.service';
import {TransformationsService} from 'src/modules/transformations/transformation.service';
import {EC_Transformations} from 'src/modules/transformations/eventsAndCommandsTransformations.data';
import {BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';

@Injectable()
export class UserCommandsService {
  constructor(
    private readonly tenantService: TenantService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly tenantUserRepository: TenantUserRepository,
    private readonly tenantUserInvitationService: TenantUserInvitationService,
    private readonly statusService: StatusService,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly integrationLogs: IntegrationLogs,
    private readonly transformationsService: TransformationsService,
  ) {}

  /**
   * Generate message payload for 'createContact' and 'contactUpdate' commands
   *
   * @param {SalesForceCommands} commandName
   * @param {Tenant} tenant
   * @param {User} user
   * @param {UserProfile} userProfile
   * @param {TenantUser} tenantUser
   * @param {CreateContactAdditionalData} additionalData
   * @return {*}  {Promise<SalesForceCommand>}
   * @memberof UserCommandsService
   */
  public async getContactCommand(
    commandName: SalesForceCommands,
    tenant: Tenant,
    user: User,
    userProfile: UserProfile,
    tenantUser: TenantUser,
    additionalData: CreateContactAdditionalData,
  ): Promise<SalesForceCommand> {
    // CLP don't need to send this information for createContact (this id will be received from SF by this command success event)
    // updateContact command must send existing externalContactId
    const commandPayload = {
      commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        externalContactId:
          commandName === SalesForceCommands.updateContact ? userProfile?.externalContactId ?? null : null,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone,
        otherPhone: userProfile.otherPhone,
        email: user.email,
        street: userProfile.street,
        street2: userProfile.street2,
        city: userProfile.city,
        state: userProfile.state,
        countryCode: userProfile.country,
        zip: userProfile.zip,
        title: userProfile.title,
        permission: await mapUserPermissions(tenantUser.roleId, additionalData.permissionNames),
        escalationTimesheetApprover: userProfile.escalationTimesheetApprover,
        externalCustomerId: additionalData.clientProfile.externalCustomerId,
        statusSF: SalesForceUserStatus.Active,
        billToInvoiceEmail: userProfile.billToInvoiceEmail,
        departmentText: userProfile.customDepartment ?? '',
        WorkerLocation: additionalData.externalLocationIds,
        branchCostCenter: additionalData.clientProfile.branchCostCenter,
      },
      keyValues: {
        statusId: tenantUser.statusId,
        roleId: tenantUser.roleId,
      },
    };

    Object.keys(commandPayload.parameters).forEach(
      (key) => (commandPayload.parameters[key] = commandPayload.parameters[key] ?? null),
    );

    const transformedCommand = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.saveContact,
      commandPayload,
      BusMessageTypeEnum.COMMAND,
    );

    return transformedCommand;
  }

  public async onCreateContactSuccess(busMessage: BusMessage) {
    const {messageName, payload: commandData, response} = busMessage;

    this.integrationLogs.commandResponseEvent(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      LogMessageType.SuccessEvent,
      messageName,
      busMessage,
    );

    const tenant = await this.tenantService.getByBrandAndCountry(commandData.body.brand, commandData.body.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const user = await this.userService.findOneByEmail(commandData.body.parameters.email);
    if (!user) {
      throw new CommonIntegrationError.UserNotFound();
    }

    try {
      if (response?.externalContactId) {
        const existingUserProfile = await this.userProfileRepository.findOne(user.id);
        existingUserProfile.externalContactId = response.externalContactId;
        await this.userProfileRepository.save(existingUserProfile);
      }
    } catch (error) {
      throw new SalesForceError.UpdateExternalContactId();
    }

    this.integrationLogs.generalInfoLog(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
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
    const {messageName, payload: commandData} = busMessage;
    this.integrationLogs.commandResponseEvent(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      LogMessageType.ErrorEvent,
      messageName,
      busMessage,
    );

    const tenant = await this.tenantService.getByBrandAndCountry(commandData.body.brand, commandData.body.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const user = await this.userService.findOneByEmail(commandData.body.parameters.email);
    if (!user) {
      throw new CommonIntegrationError.UserNotFound();
    }

    const tenantUser = await this.tenantUserRepository.findOne(tenant.id, user.id);
    if (!tenantUser) {
      throw new CommonIntegrationError.UserCountryBrandNotFound();
    }

    const status = await this.statusService.getStatusByName(tenant.id, UserStatus.CreationFailure, User.name);

    tenantUser.statusId = status.id;
    this.integrationLogs.generalInfoLog(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      LogMessageType.Command,
      ProcessingPlace.CommandErrorHandler,
      'Persisting contact creation error',
    );
    await this.tenantUserRepository.save(new TenantUser({tenantId: tenant.id, userId: user.id, statusId: status.id}));
  }
}
