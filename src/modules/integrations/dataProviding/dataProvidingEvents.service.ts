import {IntegrationLogs} from './../integrationLogging.service';
import {ServiceBusClient} from '@azure/service-bus';
import {v4 as uuid} from 'uuid';
import {Injectable} from '@nestjs/common';
import {AppConfigService} from '../../../core/config/appConfig.service';
import {DataProvidingEventObject, DataProvidingEvents} from './dataProvidingIntegrationTypes';
import {Client} from '../../client/client.entity';
import {ClientProfile} from '../../clientProfile/clientProfile.entity';
import {User} from '../../user/user.entity';
import {UserProfile} from '../../userProfile/userProfile.entity';
import {Location} from '../../location/location.entity';
import {CountryRepository} from '../../country/country.repository';
import {PlainObject} from '../../common/common.dto';
import {
  DataProvidingEvent,
  UserEventData,
  ClientEventData,
  ClientLocationEventData,
  TenantUserEventData,
  TenantUserLocationEventData,
} from './events';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {TenantRepository} from 'src/modules/tenant/tenant.repository';
import {
  BusMessageDirectionEnum,
  BusMessageScopeEnum,
  BusMessageStatusEnum,
  BusMessageTypeEnum,
} from '../../busMessage/busMessage.enum';
import {BusMessageService} from '../../busMessage/busMessage.service';
import {DataDestinationSystem} from './config/dataDestinationSystems';
import {Branch} from 'src/modules/branch/branch.entity';
import {BranchEventData} from './events/BranchEventData';
import {IntegrationSystemLogType, LogMessageType} from '../integrationSystem.enum';
import {RoleService} from 'src/modules/role/role.service';

@Injectable()
export class DataProvidingEventsService {
  private dataDestinationSystems: DataDestinationSystem[];

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly tenantRepsitory: TenantRepository,
    private readonly countryRepository: CountryRepository,
    private readonly roleService: RoleService,
    private readonly busMessageService: BusMessageService,
    private readonly integrationLogs: IntegrationLogs,
  ) {
    this.dataDestinationSystems = [
      {
        systemName: 'ClientAccess',
        eventsEnabled: this.appConfigService.clientAccessEvents.eventsEnabled,
        eventsTopic: this.appConfigService.clientAccessEvents.eventsTopic,
        connectionString: this.appConfigService.clientAccessEvents.eventsConnectionString,
        eventsConfiguration: {
          clientCreated: true,
          clientLocationCreated: true,
          clientUpdated: true,
          clientLocationUpdated: true,
          userCreated: true,
          userUpdated: true,
          tenantUserCreated: true,
          tenantUserUpdated: true,
          tenantUserLocationCreated: true,
          tenantUserLocationUpdated: true,
          branchCreated: true,
          branchUpdated: true,
        },
      },
    ];
  }

  private logError(eventName: string, error: Error): void {
    this.integrationLogs.sendInternalEventError(__filename, IntegrationSystemLogType.DataProviding, eventName, error);
  }

  public async sendClientCreated(client: Client, clientProfile: ClientProfile) {
    try {
      const clientEvent = await this.getClientEvent(DataProvidingEvents.clientCreated, client, clientProfile);
      const userProperties = {
        EventName: DataProvidingEvents.clientCreated,
        OriginSystem: 'ClientAccess',
      };
      this.execute(clientEvent, userProperties);
    } catch (e) {
      this.logError('sendClientCreated', e);
    }
  }

  public async sendClientUpdated(client: Client, clientProfile: ClientProfile) {
    try {
      const clientEvent = await this.getClientEvent(DataProvidingEvents.clientUpdated, client, clientProfile);
      const userProperties = {
        EventName: DataProvidingEvents.clientUpdated,
        OriginSystem: 'ClientAccess',
      };
      this.execute(clientEvent, userProperties);
    } catch (e) {
      this.logError('sendClientUpdated', e);
    }
  }

  public async sendUserCreated(tenantId: number, user: User, userProfile: UserProfile) {
    try {
      const userEvent = await this.getUserEvent(tenantId, DataProvidingEvents.userCreated, user, userProfile);
      const userProperties = {
        EventName: DataProvidingEvents.userCreated,
        OriginSystem: 'ClientAccess',
      };

      this.execute(userEvent, userProperties);
    } catch (e) {
      this.logError('sendUserCreated', e);
    }
  }

  public async sendUserUpdated(tenantId: number, user: User, userProfile: UserProfile) {
    try {
      const userEvent = await this.getUserEvent(tenantId, DataProvidingEvents.userUpdated, user, userProfile);
      const userProperties = {
        EventName: DataProvidingEvents.userUpdated,
        OriginSystem: 'ClientAccess',
      };
      this.execute(userEvent, userProperties);
    } catch (e) {
      this.logError('sendUserUpdated', e);
    }
  }

  public async sendClientLocationCreated(clientLocation: Location) {
    try {
      const clientLocationEvent = await this.getClientLocationEvent(
        DataProvidingEvents.clientLocationCreated,
        clientLocation,
      );
      const userProperties = {
        EventName: DataProvidingEvents.clientLocationCreated,
        OriginSystem: 'ClientAccess',
      };
      this.execute(clientLocationEvent, userProperties);
    } catch (e) {
      this.logError('sendClientLocationCreated', e);
    }
  }

  public async sendClientLocationUpdated(clientLocation: Location) {
    try {
      const clientLocationEvent = await this.getClientLocationEvent(
        DataProvidingEvents.clientLocationUpdated,
        clientLocation,
      );
      const userProperties = {
        EventName: DataProvidingEvents.clientLocationUpdated,
        OriginSystem: 'ClientAccess',
      };
      this.execute(clientLocationEvent, userProperties);
    } catch (e) {
      this.logError('sendClientLocationUpdated', e);
    }
  }

  public async sendTenantUserCreated(tenantUser: TenantUser) {
    try {
      const tenantUserEvent = await this.getTenantUserEvent(DataProvidingEvents.tenantUserCreated, tenantUser);
      const userProperties = {
        EventName: DataProvidingEvents.tenantUserCreated,
        OriginSystem: 'ClientAccess',
      };
      this.execute(tenantUserEvent, userProperties);
    } catch (e) {
      this.logError('sendTenantUserCreated', e);
    }
  }

  public async sendTenantUserUpdated(tenantUser: TenantUser) {
    try {
      const tenantUserEvent = await this.getTenantUserEvent(DataProvidingEvents.tenantUserUpdated, tenantUser);
      const userProperties = {
        EventName: DataProvidingEvents.tenantUserUpdated,
        OriginSystem: 'ClientAccess',
      };
      this.execute(tenantUserEvent, userProperties);
    } catch (e) {
      this.logError('sendTenantUserUpdated', e);
    }
  }

  public async sendTenantUserLocationCreated(tenantId: number, userId: string, locations: string[]) {
    try {
      const tenantUserLocationEvent = await this.getTenantUserLocationEvent(
        DataProvidingEvents.tenantUserLocationCreated,
        tenantId,
        userId,
        locations,
      );
      const userProperties = {
        EventName: DataProvidingEvents.tenantUserLocationCreated,
        OriginSystem: 'ClientAccess',
      };
      this.execute(tenantUserLocationEvent, userProperties);
    } catch (e) {
      this.logError('sendTenantUserLocationCreated', e);
    }
  }

  public async sendTenantUserLocationUpdated(tenantId: number, userId: string, locations: string[]) {
    try {
      const tenantUserLocationEvent = await this.getTenantUserLocationEvent(
        DataProvidingEvents.tenantUserLocationUpdated,
        tenantId,
        userId,
        locations,
      );
      const userProperties = {
        EventName: DataProvidingEvents.tenantUserLocationUpdated,
        OriginSystem: 'ClientAccess',
      };
      this.execute(tenantUserLocationEvent, userProperties);
    } catch (e) {
      this.logError('sendTenantUserLocationUpdated', e);
    }
  }

  public async sendBranchCreated(branch: Branch) {
    try {
      const branchEvent = await this.getBranchEvent(DataProvidingEvents.branchCreated, branch);
      const userProperties = {
        EventName: DataProvidingEvents.clientCreated,
        OriginSystem: 'ClientAccess',
      };
      this.execute(branchEvent, userProperties);
    } catch (e) {
      this.logError('sendClientCreated', e);
    }
  }

  public async sendBranchUpdated(branch: Branch) {
    try {
      const branchEvent = await this.getBranchEvent(DataProvidingEvents.branchUpdated, branch);
      const userProperties = {
        EventName: DataProvidingEvents.clientCreated,
        OriginSystem: 'ClientAccess',
      };
      this.execute(branchEvent, userProperties);
    } catch (e) {
      this.logError('sendClientUpdated', e);
    }
  }

  private async getUserEvent(
    tenantId: number,
    eventName: string,
    user: User,
    userProfile: UserProfile,
  ): Promise<DataProvidingEvent<UserEventData>> {
    const tenant = tenantId ? await this.tenantRepsitory.findOne(tenantId) : null;
    const country = tenant ? await this.countryRepository.findOne(tenant.countryId) : null;
    return {
      eventName: eventName,
      eventId: uuid(),
      country: country ? country.code : null,
      brand: tenant ? tenant.brand : null,
      originSystem: 'ClientAccess',
      candidateId: null,
      parameters: {
        userId: user.id,
        mainLocation: userProfile ? userProfile.mainLocationId : null,
        clientId: user.clientId ? user.clientId : null,
        B2CId: user.B2CId ? user.B2CId : null,
        phonePrefix: userProfile ? userProfile.phonePrefix : null,
        phone: userProfile ? userProfile.phone : null,
        phonePrefixOtherPhone: userProfile ? userProfile.otherPhonePrefix : null,
        otherPhone: userProfile ? userProfile.otherPhone : null,
        email: user.email,
        firstName: userProfile ? userProfile.firstName : null,
        lastName: userProfile ? userProfile.lastName : null,
        //deptFunctionId: userProfile.departmentFunctionId,
        //deptId: userProfile.departmentId,
        //customDepartment: userProfile.customDepartment,
        title: userProfile ? userProfile.title : null,
        notifications: user.emailNotifications,
      },
    };
  }

  private async getClientLocationEvent(
    eventName: string,
    clientLocation: Location,
  ): Promise<DataProvidingEvent<ClientLocationEventData>> {
    const country = await this.countryRepository.findOneByName(clientLocation.country);

    return {
      eventName: eventName,
      eventId: uuid(),
      brand: null,
      country: country?.code,
      originSystem: 'ClientAccess',
      candidateId: null,
      parameters: {
        locationId: clientLocation.id,
        clientId: clientLocation.clientId,
        locationName: clientLocation.locationName,
        city: clientLocation.city,
        state: clientLocation.state,
        street: clientLocation.street,
        postalCode: clientLocation.zip,
        isMainLocation: clientLocation.isMainLocation,
        country: clientLocation.country,
        status: clientLocation.status,
      },
    };
  }

  private async getClientEvent(
    eventName: string,
    client: Client,
    clientProfile: ClientProfile,
  ): Promise<DataProvidingEvent<ClientEventData>> {
    const country = await this.countryRepository.findOne(client.countryId);
    return {
      eventName: eventName,
      eventId: uuid(),
      brand: null,
      country: country.code,
      originSystem: 'ClientAccess',
      candidateId: null,
      parameters: {
        clientId: client.id,
        clientName: client.name,
        VAT: clientProfile.VAT,
        businessName: clientProfile.businessName,
        email: clientProfile.email,
        web: clientProfile.web,
        phone: clientProfile.phone,
        phonePrefix: clientProfile.phonePrefix,
        number: clientProfile.number,
      },
    };
  }

  private async getTenantUserEvent(
    eventName: string,
    tenantUser: TenantUser,
  ): Promise<DataProvidingEvent<TenantUserEventData>> {
    const tenant = tenantUser.tenantId ? await this.tenantRepsitory.findOne(tenantUser.tenantId) : null;
    const country = tenant ? await this.countryRepository.findOne(tenant.countryId) : null;
    const role = await this.roleService.getRoleById(tenantUser.roleId);
    return {
      eventName: eventName,
      eventId: uuid(),
      brand: tenant ? tenant.brand : null,
      country: country.code,
      originSystem: 'ClientAccess',
      candidateId: null,
      parameters: {
        userId: tenantUser.userId,
        role: role ? role.name : null,
      },
    };
  }

  private async getTenantUserLocationEvent(
    eventName: string,
    tenantId: number,
    userId: string,
    locations: string[],
  ): Promise<DataProvidingEvent<TenantUserLocationEventData>> {
    const tenant = tenantId ? await this.tenantRepsitory.findOne(tenantId) : null;
    const country = tenant ? await this.countryRepository.findOne(tenant.countryId) : null;
    return {
      eventName: eventName,
      eventId: uuid(),
      brand: tenant ? tenant.brand : null,
      country: country.code,
      originSystem: 'ClientAccess',
      candidateId: null,
      parameters: {
        userId: userId,
        locationIds: locations,
      },
    };
  }

  private async getBranchEvent(eventName: string, branch: Branch): Promise<DataProvidingEvent<BranchEventData>> {
    const tenant = await this.tenantRepsitory.findOne(branch.tenantId);
    const country = tenant ? await this.countryRepository.findOne(tenant.countryId) : null;
    return {
      eventName: eventName,
      eventId: uuid(),
      brand: tenant.brand,
      country: country.code,
      originSystem: 'ClientAccess',
      candidateId: null,
      parameters: {
        name: branch.name,
        id: branch.id,
        status: branch.status.toUpperCase(),
        branchCostCenter: branch?.branchCostCenter ?? null,
      },
    };
  }

  private async execute(eventPayload: DataProvidingEvent, userProperties: PlainObject) {
    for (const dataDestinationSystem of this.dataDestinationSystems) {
      if (!dataDestinationSystem.eventsEnabled) {
        continue;
      }

      if (!dataDestinationSystem.eventsConfiguration[eventPayload.eventName]) {
        continue;
      }

      const sendObject: DataProvidingEventObject = {
        applicationProperties: {
          ...userProperties,
        },
        body: eventPayload,
      };

      const eventsTopic = dataDestinationSystem.eventsTopic;
      this.integrationLogs.logCommand(__filename, IntegrationSystemLogType.DataProviding, eventsTopic, sendObject);

      const serviceBusClient = new ServiceBusClient(dataDestinationSystem.connectionString);
      const sender = serviceBusClient.createSender(eventsTopic);

      try {
        await this.saveEvent(sendObject);
        await sender.sendMessages(sendObject);
      } catch (e) {
        this.integrationLogs.processingMessageError(
          __filename,
          IntegrationSystemLogType.DataProviding,
          LogMessageType.Event,
          e,
          sendObject,
        );
      }
    }
  }

  private async saveEvent(sendObject) {
    const busMessageData = {
      scope: BusMessageScopeEnum.DATAPROVIDING,
      direction: BusMessageDirectionEnum.OUTBOUND,
      messageName: sendObject.body.eventName,
      messageId: sendObject.body.eventId,
      type: BusMessageTypeEnum.EVENT,
      payload: sendObject,
      status: BusMessageStatusEnum.CREATED,
    };
    return await this.busMessageService.create(busMessageData);
  }
}
