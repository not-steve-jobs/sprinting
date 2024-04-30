import {Connection} from 'typeorm';

import {Client} from 'src/modules/client/client.entity';
import {Permission} from 'src/modules/permission/permission.entity';
import {Location} from 'src/modules/location/location.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {TenantUserPermission} from 'src/modules/tenantUserPermission/tenantUserPermission.entity';
import {User} from 'src/modules/user/user.entity';
import {UserConsentService} from 'src/modules/userConsent/userConsent.service';
import {UserProfile} from 'src/modules/userProfile/userProfile.entity';
import {SeedUserDto} from 'src/modules/user/dto/seedUser.dto';
import {SeedUserProfileDto} from 'src/modules/userProfile/dto/seedUserProfile.dto';
import {SeedTenantUserDto} from 'src/modules/tenantUser/dto/seedTenantUserData.dto';

import {log} from 'src/seed/utils/seed.utils';
import {GeneratedUsersData, generateUserData, generateUsersForCypressTests, seedUsersData} from './user';
import {seedTenantUserPermissions} from './tenantUserPermission/seed';
import {seedTenantUserLocations} from './tenantUserLocation';
import {seedUserProfiles} from './userProfile';
import {seedTenantUsers} from './tenantUser';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {Status} from 'src/modules/status/status.entity';
import {LocationBranch} from 'src/modules/locationBranch/locationBranch.entity';
import {getTenantUsersByUserId, getUserByEmail} from './user/utils';
import {Invoice} from 'src/modules/invoice/invoice.entity';
import {SeedCypressInvoiceResources, seedCypressInvoices} from '../invoices';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {SeedCypressJobOrderResources, seedCypressJobOrders} from '../jobOrders/cypress.seed';
import {Certification} from 'src/modules/certification/certification.entity';
import {Level} from 'src/modules/level/level.entity';
import {Language} from 'src/modules/language/language.entity';
import {SeedCypressCaseResources, seedCypressCases} from '../cases';
import {Case} from 'src/modules/case/case.entity';

export interface SeedUserResources {
  clients: Client[];
  locations: Location[];
  permissions: Permission[];
  userConsentService: UserConsentService;
}

export interface SeedUserResponse {
  createdUsers: User[];
  createdUserProfiles: UserProfile[];
  createdTenantUsers: TenantUser[];
  createdTenantUserPermissions: TenantUserPermission[];
  createdTenantUserLocations: TenantUserLocation[];
}

/**
 * Seed demo data for the Users in the system
 *
 * @param {Connection} db - The active connection with the database
 * @param {SeedUserResources} options - List with all of resources required to seed the Users
 * @returns {Promise<SeedUserResponse>} - A list with all of the seeded Users and details for them
 */
export const seedUsers = async (db: Connection, resources: SeedUserResources): Promise<SeedUserResponse> => {
  log('Seeding Users');
  const demoData: GeneratedUsersData = await generateUserData(resources.clients);
  const testData: GeneratedUsersData = await generateUsersForCypressTests(resources.clients);

  const usersData: SeedUserDto[] = [...demoData.userData, ...(testData.userData ?? [])];
  const userProfilesData: SeedUserProfileDto[] = [...demoData.userProfileData, ...(testData.userProfileData ?? [])];
  const tenantUsersData: SeedTenantUserDto[] = [...demoData.tenantUserData, ...(testData.tenantUserData ?? [])];

  const createdUsers: User[] = await seedUsersData(db, usersData, resources.userConsentService);
  const createdUserProfiles: UserProfile[] = await seedUserProfiles(
    db,
    userProfilesData,
    createdUsers,
    resources.locations,
  );

  const createdTenantUsers: TenantUser[] = await seedTenantUsers(db, tenantUsersData);
  const createdTenantUserPermissions: TenantUserPermission[] = await seedTenantUserPermissions(
    db,
    createdTenantUsers,
    resources.permissions,
  );
  const createdTenantUserLocations: TenantUserLocation[] = await seedTenantUserLocations(
    db,
    createdTenantUsers,
    resources.locations,
  );

  return {
    createdUsers,
    createdUserProfiles,
    createdTenantUsers,
    createdTenantUserPermissions,
    createdTenantUserLocations,
  };
};

export interface SeedCypressUserResources {
  users: User[];
  tenantUsers: TenantUser[];
  tenantUserLocations: TenantUserLocation[];
  statuses: Status[];
  locationBranches: LocationBranch[];
  jobOrders: JobOrder[];
  invoices: Invoice[];
  languages: Language[];
  levels: Level[];
  certifications: Certification[];
  cases: Case[];
}

export interface SeedCypressUserResponse {
  createdCypressJobOrders: JobOrder[];
  createdCypressInvoices: Invoice[];
  createdCypressCases: Case[];
}

/**
 * Seed demo data for the Cypress Users
 * This function wil not only seed the users, but also some demo data associated with them - JobOrders and Invoices
 * Note: Maybe add a return type?
 *
 * @param {Connection} db - The active connection with the database
 * @param {SeedCypressUserResources} resources - List with all of resources required to seed the data
 * @returns {Promise<SeedCypressUserResponse[]>}
 */
export const seedCypressUser = async (
  db: Connection,
  resources: SeedCypressUserResources,
): Promise<SeedCypressUserResponse[]> => {
  log('Seeding data for Cypress user');
  const stopwatch = new Stopwatch();

  const cypressUser: User = getUserByEmail(resources.users, 'adeccocypress@gmail.com');
  const cypressTenantUsers: TenantUser[] = getTenantUsersByUserId(resources.tenantUsers, cypressUser.id);
  const cypressJobOrderResources: SeedCypressJobOrderResources = {
    statuses: resources.statuses,
    jobOrders: resources.jobOrders,
    tenantUserLocations: resources.tenantUserLocations,
    locationBranches: resources.locationBranches,
    languages: resources.languages,
    levels: resources.levels,
    certifications: resources.certifications,
  };
  const cypressInvoiceResources: SeedCypressInvoiceResources = {
    statuses: resources.statuses,
    invoices: resources.invoices,
  };
  const cypressCaseResources: SeedCypressCaseResources = {
    statuses: resources.statuses,
    cases: resources.cases,
    tenantUserLocations: resources.tenantUserLocations,
  };

  const seededCypressUsers: SeedCypressUserResponse[] = [];
  for (const cypressTenantUser of cypressTenantUsers) {
    const createdCypressJobOrders: JobOrder[] = await seedCypressJobOrders(
      db,
      cypressTenantUser,
      cypressJobOrderResources,
    );

    const createdCypressInvoices: Invoice[] = await seedCypressInvoices(db, cypressTenantUser, cypressInvoiceResources);
    const createdCypressCases: Case[] = await seedCypressCases(db, cypressTenantUser, cypressCaseResources);

    seededCypressUsers.push({
      createdCypressJobOrders,
      createdCypressInvoices,
      createdCypressCases,
    });
  }

  stopwatch.stopAndLogElapsedTime();
  return seededCypressUsers;
};
