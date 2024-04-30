import {Connection} from 'typeorm';

import {UtilsHelper} from 'src/helpers/utils.helper';
import {Country} from 'src/modules/country/country.entity';
import {tenantData} from 'src/seed/tenantSpecific/data/tenant.data';
import {generateClientName, intGuid, isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {ClientDto} from 'src/modules/client/dto/clientDto';
import {ClientProfileDto} from 'src/modules/clientProfile/dto/clientProfile.dto';
import {Client} from 'src/modules/client/client.entity';
import {ClientRepository} from 'src/modules/client/client.repository';

import {Stopwatch} from 'src/seed/utils/stopwatch';
import {DEMO_CLIENT_NAMES} from './data';

/**
 * Seed demo data for the Clients
 *
 * @param {Connection} db - The active connection with the database
 * @param {ClientDto[]} clientData - The demo data which should be seeded
 * @returns {Promise<Client[]>} - A list with all of the seeded records
 */
export const seedClientsData = async (db: Connection, clientData: ClientDto[]): Promise<Client[]> => {
  log('Seeding Client', 3);
  const stopwatch = new Stopwatch();

  const createdClients: Client[] = await Promise.all(
    clientData.map(async (data: ClientDto) => {
      return seedClient(db, data);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdClients.length}`);
  return createdClients;
};

/**
 * Seed demo data for a Client
 * TODO: Needs a bit more refactoring, move out the logic for the generation of single Client and ClientProfile
 *
 * @param {Connection} db - The active connection with the database
 * @param {ClientDto} clientData - The demo data which should be seeded
 * @returns {Promise<Client>}
 */
export const seedClient = async (db: Connection, clientData: ClientDto): Promise<Client> => {
  const isDebug = isDebugMode();
  const clientRepository: ClientRepository = db.getCustomRepository(ClientRepository);

  let client: Client = await clientRepository.findOne(clientData.id);
  if (client) {
    return client;
  }

  client = new Client(clientData);

  logSuccess(`+ Seed Client [#${client.id}] ${client.name}`, 4, isDebug);
  return await clientRepository.save(client);
};

/**
 * Generate some seed Client and ClientProfile data for the available tenants
 * The generated data will be linked with the countries of the tenants
 * We'll generate clients only for the countries which are already associated with a tenant
 * Note: Need a bit more refactoring, separate the generation of the different dto types in separate functions
 *
 * @param {Country[]} countries - List with Countries which should be used to generate some Clients
 * @returns {clientData: ClientDto[], clientProfileData: ClientProfileDto[]} - Generated details for Clients and their ClientProfile details
 */
export const generateClientSeed = (countries: Country[]) => {
  const clientData: ClientDto[] = [];
  const clientProfileData: ClientProfileDto[] = [];

  const tenantCountries: string[] = tenantData.map(({countryId}) => countryId);
  const allCountries: Country[] = countries.filter(({id}) => tenantCountries.includes(id));

  let index = 1;
  allCountries.forEach(({id: countryId, code}) => {
    DEMO_CLIENT_NAMES.forEach((clientName) => {
      const id = intGuid(index++);
      const businessName = generateClientName(clientName, code);
      const formattedBusinessName = businessName.replace(/\s/g, '').toLowerCase();

      // generate client seed data
      clientData.push({
        id,
        name: businessName,
        countryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // generate clientProfile seed data
      clientProfileData.push({
        id,
        businessName,
        number: `${index.toString().padStart(2, '0')}`.padStart(9, '0'),
        email: `${formattedBusinessName}-${index}@${formattedBusinessName}.com`,
        phone: UtilsHelper.random(1000000000, 9999999999).toString(),
        phonePrefix: '352',
        web: `${formattedBusinessName}.${index}.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });

  return {clientData, clientProfileData};
};
