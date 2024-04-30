import {Tenant} from 'src/modules/tenant/tenant.entity';
import {DestinationSystem} from 'src/modules/tenant/tenant.enum';
import {testCountry} from '../country/data';

export const testTenant: Partial<Tenant> = {
  // id: adeccoSwi.id, // TODO: Don't use the swiss tenant at some point!
  id: 1234567891, // TODO: Don't use the swiss tenant at some point!
  name: 'Test Tenant',
  alias: 'UXNZeTmQCVkTHPmfxQDc',
  brand: 'Test',
  countryId: testCountry.id,
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 9',
  domain: 'example.com',
  destinationSystem: DestinationSystem.INFOEUROPE,
};
