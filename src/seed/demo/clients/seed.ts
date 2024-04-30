import {Connection} from 'typeorm';

import {Client} from 'src/modules/client/client.entity';
import {ClientConfiguration} from 'src/modules/clientConfiguration/clientConfiguration.entity';
import {ClientProfile} from 'src/modules/clientProfile/clientProfile.entity';
import {Country} from 'src/modules/country/country.entity';

import {log} from 'src/seed/utils/seed.utils';
import {seedClientConfigurations} from './clientConfiguration';
import {generateClientSeed, seedClientsData} from './client';
import {seedClientProfilesData} from './clientProfile';

export interface SeedClientResponse {
  createdClients: Client[];
  createdClientProfiles: ClientProfile[];
  createdClientsConfigurations: ClientConfiguration[];
}

/**
 * Seed demo data for the Clients in the system
 * We seed not only Clients, but also ClientProfiles details for them
 *
 * @param {Connection} db - The active connection with the database
 * @param {Country[]} countries - List with all of the active Countries
 * @returns {Promise<SeedClientResponse>} - A list with all of the seeded Clients and details for them
 */
export const seedClients = async (db: Connection, countries: Country[]): Promise<SeedClientResponse> => {
  log('Seeding Clients');
  const {clientData, clientProfileData} = generateClientSeed(countries);

  const createdClients: Client[] = await seedClientsData(db, clientData);
  const createdClientProfiles: ClientProfile[] = await seedClientProfilesData(db, clientProfileData);
  const createdClientsConfigurations: ClientConfiguration[] = await seedClientConfigurations(db, createdClients);

  return {
    createdClients,
    createdClientProfiles,
    createdClientsConfigurations,
  };
};
