import {Injectable} from '@nestjs/common';
import {getConnection} from 'typeorm';
import {ClientRepository} from './client.repository';
import {ClientProfileRepository} from '../clientProfile/clientProfile.repository';
import {Client} from './client.entity';
import {ClientProfile} from '../clientProfile/clientProfile.entity';
import {CreateClientDto} from './dto/createClientDto';
import {ClientDto} from './dto/clientDto';
import {ClientServiceErrors} from './client.error';
import {DataProvidingEventsService} from '../integrations/dataProviding/dataProvidingEvents.service';
import {UpdateClientDto} from './dto/updateClientDto';
import {InfoCreateClientDto} from './dto/infoCreateClientDto';
import {InfoUpdateClientDto} from './dto/infoUpdateClientDto';
import {SalesForceCreateClientDto} from './dto/salesForceCreateClientDto';
import {SalesForceUpdateClientDto} from './dto/salesForceUpdateClientDto';

@Injectable()
export class ClientService {
  constructor(
    private readonly dataProvidingEventsService: DataProvidingEventsService,
    private readonly clientRepository: ClientRepository,
  ) {}

  async createFromInfo(clientData: InfoCreateClientDto): Promise<ClientDto> {
    return this.createInternal(clientData);
  }

  async createFromSalesForce(clientData: SalesForceCreateClientDto): Promise<ClientDto> {
    return this.createInternal(clientData);
  }

  async create(clientData: CreateClientDto): Promise<ClientDto> {
    return this.createInternal(clientData);
  }

  private async createInternal(
    clientData: CreateClientDto | InfoCreateClientDto | SalesForceCreateClientDto,
  ): Promise<ClientDto> {
    try {
      const client = new Client();
      if (clientData.clientId) client.id = clientData.clientId;
      if (clientData.status) client.status = clientData.status;
      client.countryId = clientData.countryId;
      client.name = clientData.name;

      const [clientSaved, clientProfileSaved] = await getConnection().transaction(async (tManager) => {
        const clientRepo = tManager.getCustomRepository(ClientRepository);
        const clientProfileRepo = tManager.getCustomRepository(ClientProfileRepository);
        const savedClient = await clientRepo.save(client);

        const clientProfileData = {
          id: savedClient.id,
          ...clientData.clientInformation,
        };
        const clientProfile = new ClientProfile(clientProfileData);

        const savedClientProfile = await clientProfileRepo.save(clientProfile);

        return [savedClient, savedClientProfile];
      });

      await this.dataProvidingEventsService.sendClientCreated(clientSaved, clientProfileSaved);
      return clientSaved;
    } catch (error) {
      throw new ClientServiceErrors.ClientCreateError(null, error);
    }
  }

  public async updateFromInfo(clientId: string, clientData: InfoUpdateClientDto): Promise<ClientDto> {
    return this.updateInternal(clientId, clientData);
  }

  public async updateFromSalesForce(clientId: string, clientData: SalesForceUpdateClientDto): Promise<ClientDto> {
    return this.updateInternal(clientId, clientData);
  }

  public async update(clientId: string, clientData: UpdateClientDto): Promise<ClientDto> {
    return this.updateInternal(clientId, clientData);
  }

  private async updateInternal(
    clientId: string,
    clientData: UpdateClientDto | InfoUpdateClientDto | SalesForceUpdateClientDto,
  ): Promise<ClientDto> {
    try {
      return await getConnection().transaction(async (tManager) => {
        const clientRepo = tManager.getCustomRepository(ClientRepository);
        const clientProfileRepo = tManager.getCustomRepository(ClientProfileRepository);

        let client = await clientRepo.findOne(clientId);
        if (clientData.name) client.name = clientData.name;
        if (clientData.countryId) client.countryId = clientData.countryId;
        if (clientData.status) client.status = clientData.status;
        client = await clientRepo.save(client);

        const clientProfile = await clientProfileRepo.findOne(clientId);
        const clientProfileData = Object.assign(clientProfile, clientData.clientInformation);

        const savedClientProfile = await clientProfileRepo.save(clientProfileData);

        await this.dataProvidingEventsService.sendClientUpdated(client, savedClientProfile);

        return client;
      });
    } catch (error) {
      throw new ClientServiceErrors.ClientCreateError(null, error);
    }
  }

  public async findOneByExternalCustomerId(externalCustomerId: string): Promise<ClientDto> {
    try {
      return await this.clientRepository.findOneByExternalCustomerId(externalCustomerId);
    } catch (error) {
      throw new ClientServiceErrors.ClientFetchError(null, error);
    }
  }
}
