import {ClientConfiguration} from 'src/modules/clientConfiguration/clientConfiguration.entity';
import {testRole} from '../role/data';
import {testClient} from '../clients/data';
import {testTenant} from '../tenant/data';

export const testClientConfiguration: Partial<ClientConfiguration> = {
  id: testClient.id,
  tenantId: testTenant.id,
  channel: 'CLA',
  feature: 'mainMenu',
  clientId: testClient.id,
  roleId: testRole.id,
};
