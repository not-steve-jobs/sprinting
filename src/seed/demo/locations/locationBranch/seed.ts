import {Connection} from 'typeorm';

import {Branch} from 'src/modules/branch/branch.entity';
import {Location} from 'src/modules/location/location.entity';
import {LocationBranchDto} from 'src/modules/locationBranch/dto/locationBranch.dto';
import {LocationBranch} from 'src/modules/locationBranch/locationBranch.entity';
import {LocationBranchRepository} from 'src/modules/locationBranch/locationBranch.repository';

import {isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {tenantData} from 'src/seed/tenantSpecific/data/tenant.data';
import {Stopwatch} from 'src/seed/utils/stopwatch';

/**
 * Seed demo data for the Branches Locations
 * TODO: Check why we seed so many locationBranches, it looks wrong
 *
 * @param {Connection} db - The active connection with the database
 * @param {LocationBranchDto[]} locationBranchData - The demo data which should be seeded
 * @returns {Promise<Branch[]>} - A list with all of the seeded records
 */
export const seedLocationBranches = async (
  db: Connection,
  locationBranchData: LocationBranchDto[],
): Promise<LocationBranch[]> => {
  log('Seeding Location Branches', 3);
  const stopwatch = new Stopwatch();

  const createdLocationBranches: LocationBranch[] = await Promise.all(
    locationBranchData.map(async (data: LocationBranchDto) => {
      return await seedLocationBranch(db, data);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdLocationBranches.length}`);
  return createdLocationBranches;
};

/**
 * Seed demo data for a Branch Location
 *
 * @param {Connection} db - The active connection with the database
 * @param {LocationBranchDto} locationBranchData - The demo data which should be seeded
 * @returns {Promise<Branch>}
 */
export const seedLocationBranch = async (
  db: Connection,
  locationBranchData: LocationBranchDto,
): Promise<LocationBranch> => {
  const isDebug = isDebugMode();
  const locationBranchRepository: LocationBranchRepository = db.getCustomRepository(LocationBranchRepository);

  let locationBranch: LocationBranch = await locationBranchRepository.findOne(
    locationBranchData.tenantId,
    locationBranchData.locationId,
    locationBranchData.branchId,
  );

  if (locationBranch) {
    return locationBranch;
  }

  locationBranch = new LocationBranch();
  Object.assign(locationBranch, locationBranchData);

  logSuccess(
    `+ Seed LocationBranch [#${locationBranch.branchId}] for Location [#${locationBranch.locationId}]`,
    4,
    isDebug,
  );
  return await locationBranchRepository.save(locationBranch);
};

/**
 * Generate some seed Location Branches data for the available tenants
 *
 * @param {Branch[]} branches - The list with Branches for which we have to generate BranchLocations
 * @param {Location[]} locations - The list with location for which we have to generate LocationBranches
 * @returns {BranchDto[]} - Generated details for Branches
 */
export const generateLocationBranchesSeedData = (branches: Branch[], locations: Location[]): LocationBranchDto[] => {
  const locationBranchData: LocationBranchDto[] = [];

  // TODO: Don't rely on the tenantData as global, receive it as input prop
  tenantData.forEach(({id: tenantId}) => {
    locations.forEach(({id: locationId}) => {
      branches
        .filter(({tenantId: branchTenantId}) => branchTenantId === tenantId)
        .forEach(({id: branchId}) => {
          locationBranchData.push({
            tenantId,
            branchId,
            locationId,
            inTerritory: true, // TODO: Seed branches which are not only inTerritory
          });
        });
    });
  });

  return locationBranchData;
};
