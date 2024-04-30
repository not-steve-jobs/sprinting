import {DestinationSystem} from '../../../modules/tenant/tenant.enum';
import {SeedFeatures} from './seedFeatures.data';

interface TenantData {
  [name: string]: any;
  seedFlags?: {[key in SeedFeatures]?: boolean};
}

// This is our default tenant that will be used as a template for new tenants
export const genericTenant: TenantData = {
  id: 99,
  name: 'Generic',
  alias: 'qGsUyp7XfwRdcfnVcaNu',
  appConfig: {
    componentsVersion: 1,
  },
  website: 'site 1',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const adeccoCA: TenantData = {
  id: 100,
  name: 'Adecco CA',
  alias: 'pdVeLK6Cw9H28mTz5EvB',
  brand: 'Adecco',
  countryId: '35059307-b388-41ad-bbf2-c8b97aba2bbb',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 2',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const adeccoUsa: TenantData = {
  id: 101,
  name: 'Adecco USA',
  alias: '38e2CUNrvn5eAqDDcK5c',
  brand: 'Adecco',
  countryId: '4ec89f5f-62fd-4824-bfd5-df9561c8aaf7',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 7',
  destinationSystem: DestinationSystem.NAM,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
  customAppProperties: null,
};

export const adeccoLux: TenantData = {
  id: 110,
  name: 'Adecco Luxembourg',
  alias: '4KMvfDR3ctu9nezXnEFv',
  brand: 'Adecco',
  countryId: 'b55b3f46-a784-4ff9-b053-b3193d191634',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 4',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const adiaLux: TenantData = {
  id: 1101,
  name: 'Adia Luxembourg',
  alias: '4KMvfDR3ctu9nezXnEFg',
  brand: 'Adia',
  countryId: 'b55b3f46-a784-4ff9-b053-b3193d191634',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 123',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const adeccoIta: TenantData = {
  id: 115,
  name: 'Adecco Italy',
  alias: 'RnMfkC9Y7CTubjnuq4tZ',
  brand: 'Adecco',
  countryId: '81289486-9d90-447e-8ad1-c4549337fb79',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 6',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const adeccoPol: TenantData = {
  id: 116,
  name: 'Adecco Poland',
  alias: 'yZzLmKHwtVMMEM9yYk27',
  brand: 'Adecco',
  countryId: '37f71376-7b0e-4473-b2f3-a2ee5b882c34',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 5',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const adeccoSwi: TenantData = {
  id: 137,
  name: 'Adecco Switzerland',
  alias: 'UXNZeTmQCVkTHPmfxQDc',
  brand: 'Adecco',
  countryId: '8055b04c-a3c5-4884-8d83-efc5bc8b8a2a',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 9',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const adeccoSpa: TenantData = {
  id: 174,
  name: 'Adecco Spain',
  alias: '8Bw8f995NNYK318pwiBf',
  brand: 'Adecco',
  countryId: 'da69ac6a-fdbf-4b90-bb56-bfbd29b22ec0',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 8',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const genericSwi: TenantData = {
  id: 94,
  name: 'Generic 94',
  alias: 'Bpux6ZWH2QD8UBfgwQXP',
  brand: 'Adecco Group',
  countryId: '8055b04c-a3c5-4884-8d83-efc5bc8b8a2a',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 94',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const adeccoGroupSwi: TenantData = {
  id: 138,
  name: 'The Adecco Group Switzerland',
  alias: 'GyCgvjTXvVNNBYVgKACb',
  brand: 'Adecco Group',
  countryId: '8055b04c-a3c5-4884-8d83-efc5bc8b8a2a',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 138',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const badenochAndClarkSwi: TenantData = {
  id: 178,
  name: 'Badenoch and Clark Switzerland',
  alias: 'C23TmlrlMD6HcDq48oCl',
  brand: 'Badenoch + Clark',
  countryId: '8055b04c-a3c5-4884-8d83-efc5bc8b8a2a',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 178',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const pontoonSwi: TenantData = {
  id: 179,
  name: 'Pontoon Switzerland',
  alias: '3n2ic5p25x448HN5BNWW',
  brand: 'Pontoon',
  countryId: '8055b04c-a3c5-4884-8d83-efc5bc8b8a2a',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 179',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const springProSwi: TenantData = {
  id: 180,
  name: 'Spring Professional Switzerland',
  alias: '203fa124Q1A7m3fWioUO',
  brand: 'Spring Professional',
  countryId: '8055b04c-a3c5-4884-8d83-efc5bc8b8a2a',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 180',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const focore: TenantData = {
  id: 88,
  name: 'InFo Core',
  alias: 'mTUN8pqh2wCgSA9EBwYD',
  brand: 'FOCORE',
  countryId: '395d3cad-1ae2-4186-a651-14e464ae6dfb',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 88',
  destinationSystem: DestinationSystem.INFOCORE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const daiGermany: TenantData = {
  id: 86,
  name: 'TAG: Data & AI Team',
  alias: 'RTnmzwRFVGnmBsDj3I3V',
  brand: 'DAI',
  countryId: '3fded299-8640-494d-b47a-65e532952e03',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 86',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const mpGermany: TenantData = {
  id: 87,
  name: 'Matching Platform Team',
  alias: 'PPRDycAMgMMXd4BCtjgv',
  brand: 'MP',
  countryId: '3fded299-8640-494d-b47a-65e532952e03',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 87',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const adeccoGermany: TenantData = {
  id: 109,
  name: 'Adecco Germany',
  alias: 'PLRwT3Nabcg7g6LMzxZx',
  brand: 'Adecco',
  countryId: '3fded299-8640-494d-b47a-65e532952e03',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 109',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const modisGermany: TenantData = {
  id: 130,
  name: 'Modis Germany',
  alias: 'LX24mYMWtxd6EELi9Go7',
  brand: 'Modis',
  countryId: '3fded299-8640-494d-b47a-65e532952e03',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 130',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const disAgGermany: TenantData = {
  id: 131,
  name: 'DIS AG Germany',
  alias: 'cAukrpzneH97AXbTsW6q',
  brand: 'DISAG',
  countryId: '3fded299-8640-494d-b47a-65e532952e03',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 131',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const badenochAndClarkGermany: TenantData = {
  id: 153,
  name: 'Badenoch and Clark Germany',
  alias: 'MAoFxpTmF6jEMXPnVF67',
  brand: 'Badenoch + Clark',
  countryId: '3fded299-8640-494d-b47a-65e532952e03',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 153',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const pontoonGermany: TenantData = {
  id: 154,
  name: 'Pontoon Germany',
  alias: '4gjNPDvH4zBZpbxG',
  brand: 'Pontoon',
  countryId: '3fded299-8640-494d-b47a-65e532952e03',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 154',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const springProGermany: TenantData = {
  id: 155,
  name: 'Spring Professional Germany',
  alias: 'KGNud8Cd2Nr67qvYDw30',
  brand: 'Spring Professional',
  countryId: '3fded299-8640-494d-b47a-65e532952e03',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 155',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const lhhGermany: TenantData = {
  id: 213,
  name: 'LHH Germany',
  alias: '9tjp3HBCpYtaqgLVH7cH',
  brand: 'LHH',
  countryId: '3fded299-8640-494d-b47a-65e532952e03',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 213',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const modisSwi: TenantData = {
  id: 264,
  name: 'Modis Switzerland',
  alias: '7J85bQ3xFTKSyLmDPBye',
  brand: 'Modis',
  countryId: '8055b04c-a3c5-4884-8d83-efc5bc8b8a2a',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 264',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: false,
    contracts: false,
    invoices: false,
  },
};

export const lhhSwi: TenantData = {
  id: 221,
  name: 'LHH CH',
  alias: 'bsjJCdj9jHr48B3RAPPY',
  brand: 'LHH',
  countryId: '8055b04c-a3c5-4884-8d83-efc5bc8b8a2a',
  appConfig: {
    componentsVersion: 2,
  },
  website: 'site 221',
  destinationSystem: DestinationSystem.INFOEUROPE,
  seedFlags: {
    staffingRequests: true,
    contracts: true,
    invoices: true,
  },
};

export const tenantData: any[] = [
  adeccoPol,
  adeccoLux,
  adiaLux,
  adeccoSwi,
  genericSwi,
  adeccoGroupSwi,
  badenochAndClarkSwi,
  pontoonSwi,
  springProSwi,
  focore,
  adeccoUsa,
  daiGermany,
  mpGermany,
  adeccoGermany,
  modisGermany,
  disAgGermany,
  badenochAndClarkGermany,
  pontoonGermany,
  springProGermany,
  lhhGermany,
  modisSwi,
  lhhSwi,
];
