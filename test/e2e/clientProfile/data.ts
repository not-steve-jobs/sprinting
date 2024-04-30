import {ClientProfile} from 'src/modules/clientProfile/clientProfile.entity';
import {testClient} from '../clients/data';

export const testClientProfile: Partial<ClientProfile> = {
  id: testClient.id,
  businessName: 'Pepsi - Test',
  number: '000000777',
  email: 'pepsi-lu-777@pepsi-lu.com',
  phone: '9913851503',
  phonePrefix: '352',
  web: 'pepsi-lu.12.com',
  VAT: null,
};
