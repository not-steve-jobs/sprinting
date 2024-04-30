import {Connection} from 'typeorm';

import {Case} from 'src/modules/case/case.entity';
import {CaseDto} from 'src/modules/case/dto/case.dto';
import {Status} from 'src/modules/status/status.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {TenantUserLocationRepository} from 'src/modules/tenantUserLocation/tenantUserLocation.repository';

import {log} from 'src/seed/utils/seed.utils';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {getTenantUserLocationByTenantIdAndUserId} from '../users/user/utils';
import {seedCase} from './case.seed';
import {filterCasesByTenant} from './utils';

export interface SeedCypressCaseResources {
  statuses: Status[];
  cases: Case[];
  tenantUserLocations: TenantUserLocation[];
}

/**
 * Seed demo Cases for the Cypress user
 *
 * @param {Connection} db - The active connection with the database
 * @param {TenantUser} cypressTenantUser - The TenantUser with which we want to associate the seeded Cases
 * @param {SeedCypressCaseResources} resources - List with all of the resources used to seed the Cases and reference with them
 * @Returns {Case[]}
 */
export const seedCypressCases = async (
  db: Connection,
  cypressTenantUser: TenantUser,
  resources: SeedCypressCaseResources,
): Promise<Case[]> => {
  log(`> Seed Cases for User #[${cypressTenantUser.userId}] on Tenant ${cypressTenantUser.tenantId}`, 3);
  const stopwatch = new Stopwatch();

  const cypressCases: Case[] = filterCasesByTenant(resources.cases, cypressTenantUser.tenantId);
  const createdCypressCases: Case[] = await Promise.all(
    cypressCases.map(async (caseToClone: Case) => {
      return await seedCypressCase(db, cypressTenantUser, resources, caseToClone);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdCypressCases.length}`);
  return createdCypressCases;
};

const seedCypressCase = async (
  db: Connection,
  cypressTenantUser: TenantUser,
  resources: SeedCypressCaseResources,
  caseEntity: Case,
): Promise<Case> => {
  const tenantUserLocationsRepository: TenantUserLocationRepository = db.getCustomRepository(
    TenantUserLocationRepository,
  );

  // We want to create a completely new Case for the Cypress user
  // Add prefix '1' to mark cloned Cases and to make difference to a original Case.
  caseEntity.id = `1${caseEntity.id.substring(1)}`;

  // We use the provided Case as a base, but e want to override some of its properties manually
  caseEntity.userId = cypressTenantUser.userId;

  // Note: Note sure what is the purpose of this but I don't like it, need to clarify it and will refactor later
  let cypressTenantUserLocation: TenantUserLocation = getTenantUserLocationByTenantIdAndUserId(
    resources.tenantUserLocations,
    cypressTenantUser.tenantId,
    cypressTenantUser.userId,
  );

  if (!cypressTenantUserLocation) {
    const tenantUserLocationToCreate: TenantUserLocation = new TenantUserLocation({
      tenantId: cypressTenantUser.tenantId,
      userId: cypressTenantUser.userId,
      locationId: cypressTenantUser.user.userProfile.mainLocationId,
    });

    cypressTenantUserLocation = await tenantUserLocationsRepository.save(tenantUserLocationToCreate);
  }

  const caseToCreate: CaseDto = {
    ...caseEntity,
    tenantId: cypressTenantUser.tenantId,
    locationId: cypressTenantUserLocation.locationId,
    userId: cypressTenantUser.userId,
  };

  return await seedCase(db, caseToCreate);
};
