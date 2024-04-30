import * as dateFns from 'date-fns';
import {intGuid} from '../../utils/seed.utils';
import {tenantData} from '../data/tenant.data';
import {ConsentType} from '../../../modules/consent/consentType.enum';

export const consentData: any[] = [];

const consents = [];

const consentPaths = {
  TERMS_AND_CONDITIONS: 'terms-of-use',
  PRIVACY_POLICY: 'privacy-policy',
  MARKETING: 'marketing',
};

Object.values(ConsentType).forEach((value) => {
  const validFrom = dateFns.subDays(new Date(), 365);

  const consentItem = {
    url: `/client/${consentPaths[value]}`,
    type: value,
    validFrom: validFrom,
    version: 1,
    isMandatory: value === 'MARKETING' ? false : true,
  };

  consents.push(consentItem);
});

let i = 0;
export const generateConsentSeedData = () => {
  tenantData.forEach((tenant) => {
    const tenantId = tenant.id;
    consents.forEach((consent) => {
      consentData.push({
        tenantId: tenantId,
        id: intGuid(i),
        url: consent.url,
        type: consent.type,
        version: consent.version,
        validFrom: consent.validFrom,
        isMandatory: consent.isMandatory,
      });
      i++;
    });
  });
  return consentData;
};
