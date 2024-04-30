import {Client} from 'src/modules/client/client.entity';
import {getRandomIntIndex} from 'src/seed/utils/seed.utils';

export const filterClientsByCountry = (clients: Client[], countryId: string): Client[] => {
  return clients.filter((client: Client) => client.countryId === countryId);
};

export const getRandomClientByCountry = (clients: Client[], countryId: string): Client => {
  const tenantClients: Client[] = filterClientsByCountry(clients, countryId);
  const client: Client = tenantClients[getRandomIntIndex(tenantClients.length)];

  return client;
};
