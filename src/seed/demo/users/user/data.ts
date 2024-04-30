import {adeccoSwi} from 'src/seed/tenantSpecific/data/tenant.data';
import {englishUsa} from '../../../tenantSpecific/featureConfiguration/features/Localization/data/languages.data';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {UserStatus} from 'src/modules/status/status.enum';
import {countryData} from 'src/seed/essential/data/country.data';
import {intGuid} from 'src/seed/utils/seed.utils';
import {statusData} from 'src/seed/tenantSpecific/data/status.data';
import {getRandomItem} from 'src/seed/utils/helpers';
import {ClientNames} from '../../clients';
import {getAllDemoUsersProps} from '../../customUsers/utils';
import {getCountryId} from './utils';
import {getPerformanceTestUsers} from './performanceTestUsers';

export interface UserDataDefault {
  mainLocationId: string;
  phone: string;
  phonePrefix: string;
  otherPhone: string;
  otherPhonePrefix: string;
  language: string;
  worksite: string;
  notifications: boolean;
  consent: boolean;
  portability: boolean;
  dataAccess: boolean;
  statusId: number;
  roleId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// Contains a definition for all of the data which is used in order to seed a User
export interface UserData extends UserDataDefault {
  id: string;
  B2CId: string;
  email: string;
  firstName: string;
  lastName: string;
  countryId: string;
  clientId?: string;
  client?: string;
}

// TODO: Read the statuses as input, not as global
// TODO: Move to utils
export const getStatusIdForTenant = (tenantId: number) => {
  return statusData.find(({name, tenantId: statusTenantId}) => {
    return name === UserStatus.Active && statusTenantId === tenantId;
  })?.id;
};

/**
 * Generate dummy data for some of the User Details fields
 *
 * @param {number} tenantId - The Tenant ID which should be used in the generated data
 * @returns {Partial<UserData>} - Some randomly dummy fake data generated for a User
 */
export const generateDefaultData = (tenantId?: number): UserDataDefault => ({
  roleId: 1,
  mainLocationId: '00000000-0000-4000-0000-000000000000',
  phone: UtilsHelper.random(1000000000, 9999999999).toString(),
  phonePrefix: '352',
  otherPhone: UtilsHelper.random(1000000000, 9999999999).toString(),
  otherPhonePrefix: '355',
  language: englishUsa.code,
  worksite: `Worksite${UtilsHelper.random(0, 9)}`,
  notifications: UtilsHelper.random(0, 1) === 1,
  consent: UtilsHelper.random(0, 1) === 1,
  portability: UtilsHelper.random(0, 1) === 1,
  dataAccess: UtilsHelper.random(0, 1) === 1,
  statusId: getStatusIdForTenant(tenantId),
  title: getRandomItem(DEMO_TITLES),
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Static details for all of the Users which should be seeded
export const users: UserData[] = [
  {
    ...generateDefaultData(),
    id: intGuid(1),
    B2CId: 'd59b3b55-1df1-45fb-927c-3082d93c978b',
    email: 'mvpdemo@mailinator.com',
    firstName: 'Melodie',
    lastName: 'King',
    countryId: getCountryId(countryData, 'FOC'),
  },
  {
    ...generateDefaultData(),
    id: intGuid(2),
    B2CId: '84308fcf-caf3-4aec-acaf-c5f42796931e',
    email: 'mvpdemo+LU@yopmail.com',
    firstName: 'Melodie (LU)',
    lastName: 'King',
    countryId: getCountryId(countryData, 'LUX'),
  },
  {
    ...generateDefaultData(),
    id: intGuid(3),
    B2CId: '33414304-395a-4a03-8136-57eefbde1c9e',
    email: 'mvpdemo+PL@yopmail.com',
    firstName: 'Melodie (PL)',
    lastName: 'King',
    countryId: getCountryId(countryData, 'POL'),
  },
  {
    ...generateDefaultData(),
    id: intGuid(4),
    B2CId: '2a45d1f4-0543-473f-a329-7ccec87d28b6',
    email: 'mvpdemo+CH@yopmail.com',
    firstName: 'Melodie (CH)',
    lastName: 'King',
    countryId: getCountryId(countryData, 'CHE'),
  },
  {
    ...generateDefaultData(),
    id: intGuid(5),
    B2CId: '35f4d231-30ba-4161-b8c9-d1a96bd426b7',
    email: 'adeccocypress@gmail.com',
    firstName: 'Cypress',
    lastName: 'Cypressic',
    countryId: getCountryId(countryData, 'LUX'),
  },
  {
    ...generateDefaultData(),
    id: intGuid(6),
    B2CId: '54ab7ecd-76b1-4622-8ec7-47a88dc9d11a',
    email: 'client.portal.ga+10@gmail.com',
    firstName: 'Google',
    lastName: 'Analytics',
    countryId: getCountryId(countryData, 'FOC'),
  },
  {
    ...generateDefaultData(),
    id: intGuid(7),
    B2CId: 'bf2de7f3-f6da-4353-a897-231573db904f',
    email: 'client.portal.ga+20@gmail.com',
    firstName: 'Test',
    lastName: 'User 1',
    countryId: getCountryId(countryData, 'FOC'),
  },
  {
    ...generateDefaultData(),
    id: intGuid(8),
    B2CId: 'fe4a6cc5-c548-41ee-917c-0af8667c2988',
    email: 'client.portal.ga+30@gmail.com',
    firstName: 'Test',
    lastName: 'User 2',
    countryId: getCountryId(countryData, 'FOC'),
  },
  {
    ...generateDefaultData(),
    id: intGuid(10),
    B2CId: '103166bb-8bd9-447c-bd2b-3a1807d8c6ac',
    email: 'mvpdemo+US@yopmail.com',
    firstName: 'Melodie (US)',
    lastName: 'King',
    countryId: getCountryId(countryData, 'USA'),
  },
  {
    ...generateDefaultData(),
    id: intGuid(12),
    B2CId: 'c2701de9-17b5-4619-beff-b8ccbec3f8a3',
    email: 'peter.clayton@yopmail.com',
    firstName: 'Peter',
    lastName: 'Clayton',
    countryId: getCountryId(countryData, 'CHE'),
    client: ClientNames.COCA_COLA,
  },
  {
    ...generateDefaultData(),
    id: intGuid(13),
    B2CId: '0003b64f-de3e-4748-b265-10b510ec9109',
    email: 'charlie.stocks@yopmail.com',
    firstName: 'Charlie',
    lastName: 'Stocks',
    countryId: getCountryId(countryData, 'CHE'),
    client: ClientNames.NESTLE,
  },
  ...getAllDemoUsersProps(),
  ...getPerformanceTestUsers(generateDefaultData(adeccoSwi.id)),
];

export const DEMO_TITLES: string[] = [
  'Vice president',
  'General manager',
  'Director',
  'Manager',
  'Supervisor',
  'Assistant manager',
  'Associate',
];
