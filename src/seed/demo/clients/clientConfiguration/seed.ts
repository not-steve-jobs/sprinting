import {Connection} from 'typeorm';

import {Client} from 'src/modules/client/client.entity';
import {ClientConfiguration} from 'src/modules/clientConfiguration/clientConfiguration.entity';
import {ClientConfigurationRepository} from 'src/modules/clientConfiguration/clientConfiguration.repository';

import {isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {clientConfigurationDataTenantAdeccoLux} from './configurations/tenantAdeccoLuxConfiguration.seed';

// TODO: Fix type
export const clientConfigurationData: any[] = [...clientConfigurationDataTenantAdeccoLux];

/**
 * Seed demo data for the ClientConfigurations in the system
 *
 * @param {Connection} db - The active connection with the database
 * @param {Client[]} clients - List with all of the Clients we want to use for the configurations
 * @returns {Promise<ClientConfiguration[]>} - A list with all of the seeded ClientConfigurations
 */
export const seedClientConfigurations = async (db: Connection, clients: Client[]): Promise<ClientConfiguration[]> => {
  log('Seeding Client Configurations', 3);
  const stopwatch = new Stopwatch();

  const createdConfigurations: ClientConfiguration[][] = await Promise.all(
    clientConfigurationData.map(async (data) => {
      const clientConfigurations: ClientConfiguration[] = await Promise.all(
        clients.map(async (client) => {
          return await seedClientConfiguration(db, data, client.id);
        }),
      );

      return clientConfigurations;
    }),
  );

  const createdClientConfigurations: ClientConfiguration[] = createdConfigurations.flat();

  stopwatch.stopAndLogElapsedTime(`count: ${createdClientConfigurations.length}`);
  return createdClientConfigurations;
};

/**
 * Seed demo data for a ClientConfiguration
 * Override the existing configuration if already seeded
 *
 * @param {Connection} db - The active connection with the database
 * @param {any} clientConfigurationData - List with all of the data which should be added for this ClientConfiguration
 * @param {string} clientId - The ID of the Client which should be associated with the configuration
 * @returns {Promise<ClientConfiguration>}
 */
export const seedClientConfiguration = async (
  db: Connection,
  clientConfigurationData: any,
  clientId: string,
): Promise<ClientConfiguration> => {
  const isDebug = isDebugMode();
  const clientConfigurationRepository: ClientConfigurationRepository = db.getCustomRepository(
    ClientConfigurationRepository,
  );

  let clientConfiguration: ClientConfiguration = await clientConfigurationRepository.findOne(
    clientConfigurationData.tenantId,
    clientConfigurationData.feature,
    clientConfigurationData.channel,
    clientConfigurationData.roleId,
    clientId,
  );

  if (!clientConfiguration) {
    clientConfiguration = new ClientConfiguration();
    clientConfiguration.clientId = clientId;
  }

  Object.assign(clientConfiguration, clientConfigurationData);

  logSuccess(
    `+ Seed ClientConfiguration of ${clientConfiguration.feature} feature for Client [#${clientConfiguration.clientId}]`,
    4,
    isDebug,
  );
  return await clientConfigurationRepository.save(clientConfiguration);
};
