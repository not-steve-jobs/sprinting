import {Injectable} from '@nestjs/common';
import {ClientProfileRepository} from './clientProfile.repository';
import {ClientProfileDto} from './dto/clientProfile.dto';
import {UpdateClientProfileDto} from './dto/updateClientProfile.dto';
import isEmpty from 'lodash/isEmpty';
import {LocationService} from '../location/location.service';
import {Location} from '../location/location.entity';
import {ClientProfile} from './clientProfile.entity';
import {DataProvidingEventsService} from '../integrations/dataProviding/dataProvidingEvents.service';
import {SharedErrors} from 'src/core/error/shared.error';
import {SalesForceCommandsService} from '../integrations/salesForce/salesForceCommands.service';
import {TenantService} from '../tenant/tenant.service';

@Injectable()
export class ClientProfileService {
  constructor(
    private readonly clientProfileRepository: ClientProfileRepository,
    private readonly locationService: LocationService,
    private readonly dataProvidingEventsService: DataProvidingEventsService,
    private readonly salesForceCommandsService: SalesForceCommandsService,
    private readonly tenantService: TenantService,
  ) {}

  async update(
    tenantId: number,
    clientId: string,
    clientProfileData: UpdateClientProfileDto,
  ): Promise<ClientProfileDto> {
    let clientProfile = new ClientProfile(clientProfileData as UpdateClientProfileDto);
    try {
      clientProfile = await this.clientProfileRepository.save(clientProfile);
    } catch (err) {
      throw new SharedErrors.EntityNotFoundError({
        id: JSON.stringify({tenantId, clientId}),
        name: 'ClientProfile',
      });
    }
    if (!isEmpty(clientProfileData.userLocation)) {
      const location = await this.locationService.updateMainLocation(
        clientProfile.client.id,
        clientProfileData.userLocation,
      );
      clientProfile.locations = [location as Location];
    }

    await this.dataProvidingEventsService.sendClientUpdated(clientProfile.client, clientProfile);

    const tenant = await this.tenantService.findOne(tenantId);
    await this.salesForceCommandsService.sendCustomerUpdated(tenant, clientProfile);

    return new ClientProfileDto(clientProfile);
  }

  async get(tenantId: number, clientId: string): Promise<ClientProfileDto> {
    return new ClientProfileDto(await this.clientProfileRepository.findOneWithLocations(clientId));
  }

  async getByExternalCustomerId(externalCustomerId: string): Promise<ClientProfile> {
    return this.clientProfileRepository.findByExternalCustomerId(externalCustomerId);
  }

  async getOneOrFail(tenantId: number, clientId: string): Promise<ClientProfileDto> {
    const clientProfile = await this.clientProfileRepository.findOneWithLocations(clientId);
    if (!clientProfile) {
      throw new SharedErrors.EntityNotFoundError({
        id: JSON.stringify({tenantId, clientId}),
        name: 'ClientProfile',
      });
    }

    return new ClientProfileDto(clientProfile);
  }
}
