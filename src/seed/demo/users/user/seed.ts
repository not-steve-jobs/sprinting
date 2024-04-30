import {Connection} from 'typeorm/connection/Connection';

import {UtilsHelper} from 'src/helpers/utils.helper';
import {User} from 'src/modules/user/user.entity';
import {UserRepository} from 'src/modules/user/user.repository';
import {UserConsentService} from 'src/modules/userConsent/userConsent.service';
import {Client} from 'src/modules/client/client.entity';
import {SeedUserDto} from 'src/modules/user/dto/seedUser.dto';
import {SeedUserProfileDto} from 'src/modules/userProfile/dto/seedUserProfile.dto';
import {SeedTenantUserDto} from 'src/modules/tenantUser/dto/seedTenantUserData.dto';

import {tenantData} from 'src/seed/tenantSpecific/data/tenant.data';
import {generateClientName, intGuid, isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {countryData} from 'src/seed/essential/data/country.data';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {UserConsent} from 'src/modules/userConsent/userConsent.entity';
import {getCountryCode} from './utils';
import {UUIDSection} from 'src/seed/utils/uuidSection.enum';
import {getRandomItem} from 'src/seed/utils/helpers';
import {filterClientsByCountry} from '../../clients';
import {generateDefaultData, getStatusIdForTenant, UserData, users} from './data';
import {getCountryIdsByDemoEmail, getDemoUsersEmails} from '../../customUsers/utils';

// TODO: This file need more refactoring

/**
 * Seed demo data for the Users
 *
 * @param {Connection} db - The active connection with the database
 * @param {SeedUserDto[]} usersData - The demo data which should be seeded
 * @param {UserConsentService} userConsentService - The service which should be used to accept the consent for the Cypress user
 * @returns {Promise<User[]>} - A list with all of the seeded records
 */
export const seedUsersData = async (
  db: Connection,
  usersData: SeedUserDto[],
  userConsentService: UserConsentService,
): Promise<User[]> => {
  log('Seeding Users', 3);
  const stopwatch = new Stopwatch();

  const createdUsers: User[] = await Promise.all(
    usersData.map(async (data: SeedUserDto) => {
      return await seedUser(db, data, userConsentService);
    }),
  ).then((result) => result.filter((item) => item !== null));

  stopwatch.stopAndLogElapsedTime(`count: ${createdUsers.length}`);
  return createdUsers;
};

/**
 * Seed demo data for the Users
 *
 * @param {Connection} db - The active connection with the database
 * @param {SeedUserDto[]} usersData - The demo data which should be seeded
 * @param {UserConsentService} userConsentService - The service which should be used to accept the consent for the Cypress user
 * @returns {Promise<User[]>} - A list with all of the seeded records
 */
export const seedUser = async (
  db: Connection,
  userData: SeedUserDto,
  userConsentService: UserConsentService,
): Promise<User> => {
  const isDebug = isDebugMode();
  const userRepository: UserRepository = db.getCustomRepository(UserRepository);

  let user: User = await userRepository.findOneByEmail(userData.email);
  if (user) {
    return user;
  }

  user = new User();
  Object.assign(user, userData);

  const createdUser = await userRepository.save(user);
  await signUserConsent(createdUser, userConsentService);

  logSuccess(`+ Seed User [#${createdUser.id}] ${createdUser.email} for Client [#${createdUser.clientId}]`, 4, isDebug);
  return createdUser;
};

/**
 * Sign all consents for adeccocypress@gmail.com user (need this for tests)
 *
 * @param {User} user - The User for which we want to sign the Consent
 * @param {UserConsentService} userConsentService - The service which should be used to accept the consent for the Cypress user
 * @returns List with promises for all of the accepted concents
 */
const signUserConsent = async (user: User, userConsentService: UserConsentService): Promise<UserConsent[]> => {
  const createdUserConsents: UserConsent[] = await Promise.all(
    tenantData.map(async (tenant) => {
      if (user.email === 'adeccocypress@gmail.com') {
        const unsignedConsents = await userConsentService.check(tenant.id, user.id);
        await userConsentService.create(tenant.id, user.id, unsignedConsents);
      }

      return null;
    }),
  );

  return createdUserConsents;
};

export interface GeneratedUsersData {
  userData: SeedUserDto[];
  userProfileData: SeedUserProfileDto[];
  tenantUserData: SeedTenantUserDto[];
}

/**
 * Generate demo data for Users, UserProfiles and TenantUsers
 *
 * @param {Client[]} clients - List with all available Clients
 * @returns {Promise<GeneratedUsersData>} - Demo data generated for the Users
 */
export const generateUserData = async (clients: Client[]): Promise<GeneratedUsersData> => {
  const userData: SeedUserDto[] = [];
  const userProfileData: SeedUserProfileDto[] = [];

  // add default users
  users.forEach((user: UserData) => {
    const clientsByCountry: Client[] = filterClientsByCountry(clients, user.countryId);

    let client: Client = getRandomItem(clientsByCountry);
    if (user.client) {
      // Not sure why we do this?
      const filteredClient = clients.filter(
        (client) => client.name === generateClientName(user.client, getCountryCode(countryData, user.countryId)),
      );

      if (filteredClient.length > 0) {
        client = filteredClient[0];
      }
    }

    if (!client) {
      return;
    }

    const _user = {...user, clientId: client.id};

    userData.push(parseUserData(_user));
    userProfileData.push(parseUserProfileData(_user));
  });

  const tenantUserData: SeedTenantUserDto[] = parseTenantUserData(userData);

  return {userData, userProfileData, tenantUserData};
};

/**
 * Generate demo data for Users, UserProfiles and TenantUsers but all this data will be generated only for cypress purposes
 * Note: adds one 'admin' and one 'user' user type per client
 * TODO: This function need a bit more refactoring
 *
 * @param {Client[]} createdClients - List with all available Clients
 * @returns {Promise<GeneratedUsersData>} - Demo data generated for the Users
 */
export const generateUsersForCypressTests = async (clients: Client[]): Promise<GeneratedUsersData> => {
  const testUsersData: SeedUserDto[] = [];
  const testUserProfilesData: SeedUserProfileDto[] = [];

  let userCounter = 1;
  const allActiveTenantCountries = tenantData.map(({countryId}) => countryId);
  (clients ?? [])
    // only use clients which are within currently available tenants
    .filter((createdClient) => allActiveTenantCountries.includes(createdClient.countryId))
    .forEach(({id: clientId, countryId}) => {
      const countryCode = getCountryCode(countryData, countryId) ?? 'NN';
      // log(`[${countryCode}] [${clientId}]: ${name}`, 4);
      // 1 - admin role, 2 - user role
      [1, 2].forEach((roleId: number) => {
        const id = intGuid(userCounter, UUIDSection.CypressUsers);
        // log(`user: ${id} (role: ${roleId})`, 8);
        const user = {
          ...generateDefaultData(),
          id,
          B2CId: id,
          email: `test+${countryCode}_${userCounter}@yopmail.com`,
          worksite: `test${UtilsHelper.random(0, 9)}`,
          firstName: `Test`,
          lastName: `Test ${userCounter}`,
          countryId,
          roleId,
          clientId,
        };

        testUsersData.push({...parseUserData(user)});
        testUserProfilesData.push(parseUserProfileData(user));
        userCounter++;
      });
    });

  const testTenantUsersData: SeedTenantUserDto[] = parseTenantUserData(testUsersData);

  return {
    userData: testUsersData,
    userProfileData: testUserProfilesData,
    tenantUserData: testTenantUsersData,
  };
};

// TODO: Export as helper function
const getTenantsByCountryIds = (countryIds: string[]) => {
  return tenantData.filter((tenant) => countryIds.includes(tenant.countryId));
};

/**
 * Parse an User Data object to filter out only the fields related with the User entity
 *
 * @param {UserData} userData - Data which will be used to seed the User
 * @returns {SeedUserDto} - Filtered out fields only related with the User entity
 */
const parseUserData = (userData: UserData): SeedUserDto => ({
  id: userData.id,
  B2CId: userData.B2CId,
  email: userData.email,
  roleId: userData.roleId,
  statusId: userData.statusId,
  countryId: userData.countryId,
  clientId: userData.clientId,
  createdAt: userData.createdAt,
  updatedAt: userData.updatedAt,
});

/**
 * Prepare some data which should be used to create TenantUser seeds
 *
 * @param {SeedUserDto} usersData - List with details for all of the Users which have to be used to generate TenantUsers for
 * @returns {SeedTenantUserDto} - Filtered out fields only related with the TenantUser entity
 */
const parseTenantUserData = (usersData: SeedUserDto[]): SeedTenantUserDto[] => {
  const tenantUsers: SeedTenantUserDto[] = [];
  const demoUsers: string[] = getDemoUsersEmails();

  usersData.forEach(({id: userId, roleId, email, countryId}) => {
    let tenantsByCountryId = null;
    switch (true) {
      case demoUsers.includes(email):
        tenantsByCountryId = getTenantsByCountryIds(getCountryIdsByDemoEmail(email));
        break;
      case email === 'adeccocypress@gmail.com':
        tenantsByCountryId = tenantData;
        break;
      default:
        tenantsByCountryId = getTenantsByCountryIds([countryId]);
        break;
    }

    tenantsByCountryId.forEach(({id: tenantId}) => {
      const statusId = getStatusIdForTenant(tenantId);
      tenantUsers.push({
        tenantId,
        userId,
        roleId,
        statusId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });

  return tenantUsers;
};

/**
 * Parse an User Data object to filter out only the fields related with the UserProfile entity
 *
 * @param {UserData} userData - Data which will be used to seed the User
 * @returns {SeedUserProfileDto} - Filtered out fields only related with the UserProfile entity
 */
const parseUserProfileData = (userData: UserData): SeedUserProfileDto => ({
  id: userData.id,
  firstName: userData.firstName,
  lastName: userData.lastName,
  mainLocationId: userData.mainLocationId,
  phone: userData.phone,
  phonePrefix: userData.phonePrefix,
  otherPhone: userData.otherPhone,
  otherPhonePrefix: userData.otherPhonePrefix,
  language: userData.language,
  worksite: userData.worksite,
  notifications: userData.notifications,
  consent: userData.consent,
  portability: userData.portability,
  dataAccess: userData.dataAccess,
  // postCode: userData.postCode, // TODO: Maybe no longer used
  title: userData.title,
  createdAt: userData.createdAt,
  updatedAt: userData.updatedAt,
});
