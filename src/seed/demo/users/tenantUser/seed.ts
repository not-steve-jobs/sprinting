import {Connection} from 'typeorm';

import {SeedTenantUserDto} from 'src/modules/tenantUser/dto/seedTenantUserData.dto';
import {TenantUserDto} from 'src/modules/tenantUser/dto/tenantUser.dto';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {TenantUserRepository} from 'src/modules/tenantUser/tenantUser.repository';
import {isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {Stopwatch} from 'src/seed/utils/stopwatch';

/**
 * Seed demo data for the Tenant Users
 *
 * @param {Connection} db - The active connection with the database
 * @param {SeedTenantUserDto[]} tenantUsersData - The demo data which should be seeded
 * @returns {Promise<TenantUser[]>} - A list with all of the seeded records
 */
export const seedTenantUsers = async (db: Connection, tenantUsersData: SeedTenantUserDto[]): Promise<TenantUser[]> => {
  const tenantUserRepository: TenantUserRepository = db.getCustomRepository(TenantUserRepository);

  log('Seeding Tenant Users', 3);
  const stopwatch = new Stopwatch();

  const createdTenantUsers: TenantUser[] = await Promise.all(
    tenantUsersData.map(async (tenantUserData: TenantUserDto) => {
      return await seedTenantUser(db, tenantUserData);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdTenantUsers.length}`);

  // If we create new record the returned entities doesn't contain all of the relationships, so we pull them manually once more
  // TODO: Change the query to find all which are generated, not all real TenantUsers because it can cause issues for some of them which don't have any Locations or Permissions
  const tenantUsers: TenantUser[] = await tenantUserRepository.findAll();

  return tenantUsers;
};

/**
 * Seed demo data for a Tenant User
 *
 * @param {Connection} db - The active connection with the database
 * @param {TenantUserDto} tenantUserData - The demo data which should be seeded
 * @returns {Promise<TenantUser>}
 */
export const seedTenantUser = async (db: Connection, tenantUserData: TenantUserDto): Promise<TenantUser> => {
  const isDebug = isDebugMode();
  const tenantUserRepository: TenantUserRepository = db.getCustomRepository(TenantUserRepository);

  let tenantUser: TenantUser = await tenantUserRepository.findOne(tenantUserData.tenantId, tenantUserData.userId);
  if (tenantUser) {
    return tenantUser;
  }

  tenantUser = new TenantUser();
  Object.assign(tenantUser, tenantUserData);

  logSuccess(`+ Seed TenantUser [#${tenantUser.userId}] for Tenant ${tenantUser.tenantId}`, 4, isDebug);
  return tenantUserRepository.save(tenantUser);
};
