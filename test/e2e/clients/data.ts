import {Client} from 'src/modules/client/client.entity';
import {getTestDate} from '../utils/helpers';
import {testCountry} from '../country/data';

export const testClient: Partial<Client> = {
  id: '12345678-0000-4000-0000-000000000001',
  countryId: testCountry.id,
  name: 'Test Client',
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testChangedClient: Partial<Client> = {
  id: '12345678-0000-4000-0000-000000000002',
  countryId: testCountry.id,
  name: 'Test Client Changed',
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testClients: Partial<Client>[] = [testClient, testChangedClient];
