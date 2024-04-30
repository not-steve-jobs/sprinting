import {IntegrationLogs} from './../integrationLogging.service';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {ServiceBusClient} from '@azure/service-bus';
import {Injectable} from '@nestjs/common';
import {AppConfigService} from '../../../core/config/appConfig.service';
import {
  SalesForceApplicationProperties,
  SalesForceCommandObject,
  SalesForceCommands,
  SalesForceCommandWithParameters,
} from './salesForceIntegrationTypes';
import {User} from '../../user/user.entity';
import {UserProfile} from '../../userProfile/userProfile.entity';
import {Tenant} from '../../tenant/tenant.entity';
import {CommonIntegrationService} from '../commonIntegration.service';
import {CustomAppProperties, DestinationSystem} from '../../tenant/tenant.enum';
import {UserCommandsService} from './commands/userCommands.service';
import {CreateContactAdditionalData} from './commandModels/contactData';
import {IntegrationSystemLogType} from '../integrationSystem.enum';
import {BusMessageScopeEnum} from 'src/modules/busMessage/busMessage.enum';
import {JobCommandsService} from './commands/jobCommands.service';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {UserProfileService} from 'src/modules/userProfile/userProfile.service';
import {TenantUserPermissionRepository} from 'src/modules/tenantUserPermission/tenantUserPermission.repository';
import {TenantUserLocationRepository} from 'src/modules/tenantUserLocation/tenantUserLocation.repository';
import {TenantUserRepository} from 'src/modules/tenantUser/tenantUser.repository';
import {CustomerCommandsService} from './commands/customerCommands.service';
import {ClientProfile} from 'src/modules/clientProfile/clientProfile.entity';

@Injectable()
export class SalesForceCommandsService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly userCommandsService: UserCommandsService,
    private readonly jobCommandsService: JobCommandsService,
    private readonly commonIntegrationService: CommonIntegrationService,
    private readonly integrationLogs: IntegrationLogs,
    private readonly userProfileService: UserProfileService,
    private readonly tenantUserRepository: TenantUserRepository,
    private readonly tenantUserPermissionRepository: TenantUserPermissionRepository,
    private readonly tenantUserLocationRepository: TenantUserLocationRepository,
    private readonly customerCommandsService: CustomerCommandsService,
  ) {}

  /**
   * Send 'updateContact' command
   * because this method is invoked inside transaction we need to provide all necessary data.
   *
   *
   * @param {Tenant} tenant
   * @param {User} user
   * @param {UserProfile} userProfile
   * @param {TenantUser} tenantUser
   * @param {CreateContactAdditionalData} additionalData
   * @memberof SalesForceCommandsService
   */
  public async sendContactCreated(
    tenant: Tenant,
    user: User,
    userProfile: UserProfile,
    tenantUser: TenantUser,
    additionalData: CreateContactAdditionalData,
  ) {
    this.execute(
      await this.userCommandsService.getContactCommand(
        SalesForceCommands.createContact,
        tenant,
        user,
        userProfile,
        tenantUser,
        additionalData,
      ),
      this.prepareApplicationProperties(tenant, SalesForceCommands.createContact),
    );
  }

  public async sendContactUpdated(
    tenant: Tenant,
    user: User,
    userProfile: UserProfile,
    tenantUser: TenantUser,
    additionalData: CreateContactAdditionalData,
  ) {
    this.execute(
      await this.userCommandsService.getContactCommand(
        SalesForceCommands.updateContact,
        tenant,
        user,
        userProfile,
        tenantUser,
        additionalData,
      ),
      this.prepareApplicationProperties(tenant, SalesForceCommands.updateContact),
    );
  }

  /**
   * Send 'updateContact' command without providing all necessary data through arguments
   *
   * @param {Tenant} tenant
   * @param {string} userId
   * @memberof SalesForceCommandsService
   */
  public async sendContactUpdatedWithoutRelations(tenant: Tenant, userId: string) {
    const userProfile = await this.userProfileService.findOneWithRelations(userId, [
      'user',
      'user.client',
      'user.client.clientProfile',
    ]);

    const tenantUser = await this.tenantUserRepository.findOne(tenant.id, userProfile.user.id);

    const userPermissionNames = await this.tenantUserPermissionRepository.getUserPermissionNames(
      tenant.id,
      userProfile.id,
      tenantUser.tenantUserPermissions.map(({permissionId}) => permissionId),
    );

    const externalLocationIds = await this.tenantUserLocationRepository.getUserExternalLocationIds(
      tenant.id,
      userProfile.id,
    );

    this.execute(
      await this.userCommandsService.getContactCommand(
        SalesForceCommands.updateContact,
        tenant,
        userProfile.user,
        userProfile,
        tenantUser,
        {
          clientProfile: userProfile?.user?.client?.clientProfile,
          permissionNames: userPermissionNames,
          externalLocationIds: externalLocationIds,
        },
      ),
      this.prepareApplicationProperties(tenant, SalesForceCommands.updateContact),
    );
  }

  public async sendCustomerUpdated(tenant: Tenant, clientProfile: ClientProfile) {
    this.execute(
      await this.customerCommandsService.getUpdateCustomerCommand(tenant, clientProfile),
      this.prepareApplicationProperties(tenant, SalesForceCommands.updateCustomer),
    );
  }

  public async sendJobCreated(tenant: Tenant, jobOrderEntity: JobOrder) {
    return this.execute(
      await this.jobCommandsService.getCreateJobCommand(SalesForceCommands.createJob, tenant, jobOrderEntity),
      this.prepareApplicationProperties(tenant, SalesForceCommands.createJob),
    );
  }

  public async sendJobUpdated(tenant: Tenant, jobOrderEntity: JobOrder) {
    return this.execute(
      await this.jobCommandsService.getUpdateJobCommand(SalesForceCommands.updateJob, tenant, jobOrderEntity),
      this.prepareApplicationProperties(tenant, SalesForceCommands.updateJob),
    );
  }

  private isDestinationSystemValid(destinationSystem: DestinationSystem): boolean {
    return [DestinationSystem.NAM].includes(destinationSystem);
  }

  private getDestinationSystem(tenant: Tenant): DestinationSystem {
    let destinationSystem: DestinationSystem = DestinationSystem.NONE;
    // check if tenant has destination system from this file and only in that case allow command sending
    if (this.isDestinationSystemValid(tenant.destinationSystem)) {
      destinationSystem = tenant.destinationSystem;
    }
    return destinationSystem;
  }

  private prepareApplicationProperties(tenant: Tenant, commandName: SalesForceCommands) {
    const customDestinationSystem: CustomAppProperties = this.handleCustomDestinationSystem(tenant, commandName);
    if (customDestinationSystem) {
      return {
        CommandName: commandName,
        DestinationSystem: customDestinationSystem.destinationSystem,
      };
    }

    return {
      CommandName: commandName,
      DestinationSystem: this.getDestinationSystem(tenant),
    };
  }

  private handleCustomDestinationSystem(tenant: Tenant, commandName: SalesForceCommands): CustomAppProperties | null {
    if (tenant.customAppProperties) {
      return tenant.customAppProperties.find(
        (cap) => commandName === cap.commandName && this.isDestinationSystemValid(cap.destinationSystem),
      );
    }
    return null;
  }

  public async execute(
    commandPayload: SalesForceCommandWithParameters,
    applicationProperties: SalesForceApplicationProperties,
    busMessageId: string = null,
    fixedBy: string = null,
  ) {
    const {commandsEnabled, commandsConnectionString, commandsTopic} = this.appConfigService.salesForceIntegration;

    if (!commandsEnabled) {
      return;
    }

    // prevent command sending if destination system is missing
    if (applicationProperties.DestinationSystem === DestinationSystem.NONE) {
      this.integrationLogs.missingDestinationSystem(__filename, IntegrationSystemLogType.SalesForceIntegration, {
        commandName: commandPayload.commandName,
        brand: commandPayload.brand,
        country: commandPayload.country,
      });
      return;
    }

    const sendObject: SalesForceCommandObject = {
      applicationProperties: applicationProperties,
      body: commandPayload,
    };

    this.integrationLogs.logCommand(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      commandsTopic,
      sendObject,
    );

    const serviceBusClient = new ServiceBusClient(commandsConnectionString);

    const sender = serviceBusClient.createSender(commandsTopic);

    try {
      await sender.sendMessages(sendObject);
      if (busMessageId) {
        await this.commonIntegrationService.saveCommandAttempt(busMessageId, fixedBy);
      } else {
        await this.commonIntegrationService.saveCommand(sendObject, BusMessageScopeEnum.SALESFORCE);
      }
    } catch (e) {
      this.integrationLogs.sendCommandMessageError(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        commandsTopic,
        e,
      );
    }
  }
}
