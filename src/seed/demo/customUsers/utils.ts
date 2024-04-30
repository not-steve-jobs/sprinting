import {log, logError, logSuccess} from 'src/seed/utils/seed.utils';
import {Connection} from 'typeorm';
import UserSeed from './UserSeed';
import {generateDefaultData, UserData} from '../users/user/data';
import {allDemoUsersData} from './allDemoUsersData.seed';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {GenerateJobOrderResources} from '../jobOrders/jobOrder/seed';
import {User} from 'src/modules/user/user.entity';
import {TenantUserPermissionService} from 'src/modules/tenantUserPermission/tenantUserPermission.service';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {CloseReason} from 'src/modules/closeReason/closeReason.entity';

export interface DemoUserData {
  user: UserProperties;
  jobOrders: UserDataConfig[];
}

export interface UserProperties {
  email: string;
  id: string;
  B2CId: string;
  firstName: string;
  lastName: string;
  countryIds?: string[];
  countryId?: string;
}

export interface AssociateProperties {
  userId: string;
  status: string;
}

export interface JobOrderProperties {
  name: string;
  orderStatus: string;
  numberOfOpenings: number;
  candidates: AssociateProperties[];
}

export interface UserDataConfig {
  tenantId: number;
  jobOrderProps: JobOrderProperties[];
}

export interface SeedCustomUserResources extends GenerateJobOrderResources {
  users: User[];
  jobOrders: JobOrder[];
  closeReasons: CloseReason[];
  tenantUserPermissionService: TenantUserPermissionService;
}

/**
 * Returns all emails of demo users.
 *
 * @returns {string[]} - Emails of demo users
 */
export const getDemoUsersEmails = (): string[] => {
  const emails: string[] = [];
  allDemoUsersData.forEach((demoData: DemoUserData) => {
    emails.push(demoData.user.email);
  });
  return emails;
};

/**
 * Returns the country IDs of a demo user by provided email.
 *
 * @param {string} email - Email of demo user
 * @returns {string[]} - Country IDs of demo user
 */
export const getCountryIdsByDemoEmail = (email: string): string[] => {
  let countryIds: string[] = [];
  allDemoUsersData.forEach((demoData: DemoUserData) => {
    if (demoData.user.email === email) {
      countryIds = demoData.user.countryIds;
    }
  });
  return countryIds;
};

/**
 * Returns an array of all demo user accounts, ready for seeding.
 *
 * @returns {string[]} - Array of all demo user accounts
 */
export const getAllDemoUsersProps = (): UserData[] => {
  const demoUsers: UserData[] = [];
  allDemoUsersData.forEach((demoData: DemoUserData) => {
    demoUsers.push({
      id: demoData.user.id,
      B2CId: demoData.user.B2CId,
      email: demoData.user.email,
      firstName: demoData.user.firstName,
      lastName: demoData.user.lastName,
      countryId: demoData.user.countryIds[0],
      ...generateDefaultData(),
    });
  });
  return demoUsers;
};

/**
 * Call the data generation functions for a demo users.
 *
 * @param {DemoUserData} rawData - Data of demo user
 * @param {Connection} db - The active connection with the DB
 * @param {SeedCustomUserResources} resources - List with all of the resources required for the generation of the demo data
 */
export const demoUserSeeder = async (rawData: DemoUserData, db: Connection, resources: SeedCustomUserResources) => {
  try {
    await new UserSeed({
      rawData,
      databaseRef: db,
      resources,
    })
      .generateUserData()
      .then(() => {
        logSuccess(`${rawData.user.firstName}'s data inserted successfully`, 3);
      })
      .catch((er) => {
        logError(`Something went wrong while inserting ${rawData.user.firstName}'s data: ${er}`, 3);
      });
  } catch (err) {
    console.log('err', err);
  }
};

/**
 * Seed demo data for the custom Users. This includes not only the Users, but also Job Orders and Associates.
 *
 * @param {Connection} db - The active connection with the DB
 * @param {SeedCustomUserResources} resources - List with all of the resources required for the generation of the demo data
 */
export const seedCustomUsers = async (db: Connection, resources: SeedCustomUserResources) => {
  log(`Seeding custom users`);
  const stopwatch = new Stopwatch();
  const seeders: Promise<void>[] = [];
  allDemoUsersData.forEach((rawData: DemoUserData) => {
    seeders.push(demoUserSeeder(rawData, db, resources));
  });
  await Promise.all(seeders);
  stopwatch.stopAndLogElapsedTime();
};
