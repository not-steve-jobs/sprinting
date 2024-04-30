import {Location} from 'src/modules/location/location.entity';
import {LocationStatusEnum} from 'src/modules/location/location.enum';

import {getTestDate} from '../utils/helpers';
import {testClient} from '../clients/data';
import {testCountry} from '../country/data';

export const testLocation: Partial<Location> = {
  id: '12345678-0000-4000-0000-000000000001',
  clientId: testClient.id,
  isMainLocation: true,
  locationName: 'Test Location',
  street: 'Test Street',
  number: 'Test Number 123',
  city: 'Test City',
  state: 'Test State',
  country: testCountry.name,
  zip: 'Test ZIP 123',
  status: LocationStatusEnum.Active,
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testChangedLocation: Partial<Location> = {
  id: '12345678-0000-4000-0000-000000000002',
  clientId: testClient.id,
  isMainLocation: true,
  locationName: 'Test Location',
  street: 'Test Street',
  number: 'Test Number 123',
  city: 'Test City',
  state: 'Test State',
  country: testCountry.name,
  zip: 'Test ZIP 123',
  status: LocationStatusEnum.Active,
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testLocations: Partial<Location>[] = [testLocation, testChangedLocation];
