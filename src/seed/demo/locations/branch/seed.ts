import {Connection} from 'typeorm/connection/Connection';

import {Branch} from 'src/modules/branch/branch.entity';
import {Location} from 'src/modules/location/location.entity';
import {BranchRepository} from 'src/modules/branch/branch.repository';
import {BranchDto} from 'src/modules/branch/dto/branch.dto';
import {LocationBranchDto} from 'src/modules/locationBranch/dto/locationBranch.dto';
import {LocationBranch} from 'src/modules/locationBranch/locationBranch.entity';

import {tenantData} from 'src/seed/tenantSpecific/data/tenant.data';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {intGuid, getRandomIntIndex, log, logSuccess, isDebugMode} from 'src/seed/utils/seed.utils';
import {generateLocationBranchesSeedData, seedLocationBranches} from '../locationBranch';
import {DEMO_BRANCH_STATUSES, STATIC_BRANCHES} from './data';
import {getRandomItem} from 'src/seed/utils/helpers';
import {DEMO_LOCATION_NAMES} from '../location';

export interface SeedBranchesResponse {
  createdBranches: Branch[];
  createdLocationBranches: LocationBranch[];
}

/**
 * Seed demo data for the Branches in the system
 *
 * @param {Connection} db - The active connection with the database
 * @param {Location[]} countries - List with all of the active Locations which should be associated with the Branches
 * @returns {Promise<Branch[]>} - A list with all of the seeded Branches
 */
export const seedBranches = async (db: Connection, locations: Location[]): Promise<SeedBranchesResponse> => {
  log('Seeding Branches');

  const branchesData: BranchDto[] = generateBranchesSeedData();
  const createdBranches: Branch[] = await seedBranchesData(db, branchesData);

  const locationBranchData: LocationBranchDto[] = generateLocationBranchesSeedData(createdBranches, locations);
  const createdLocationBranches: LocationBranch[] = await seedLocationBranches(db, locationBranchData);

  return {createdBranches, createdLocationBranches};
};

/**
 * Seed demo data for the Branches
 *
 * @param {Connection} db - The active connection with the database
 * @param {BranchDto[]} branchesData - The demo data which should be seeded
 * @returns {Promise<Branch[]>} - A list with all of the seeded records
 */
const seedBranchesData = async (db: Connection, branchesData: BranchDto[]): Promise<Branch[]> => {
  log('Seeding Branches', 3);
  const stopwatch = new Stopwatch();

  const createdBranches: Branch[] = await Promise.all(
    branchesData.map(async (data: BranchDto) => {
      return await seedBranch(db, data);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdBranches.length}`);
  return createdBranches;
};

/**
 * Seed demo data for a Branch
 *
 * @param {Connection} db - The active connection with the database
 * @param {BranchDto} branchesData - The demo data which should be seeded
 * @returns {Promise<Branch>}
 */
const seedBranch = async (db: Connection, branchData: BranchDto): Promise<Branch> => {
  const isDebug = isDebugMode();
  const branchRepository: BranchRepository = db.getCustomRepository(BranchRepository);

  let branch: Branch = await branchRepository.findOneByBranchId(branchData.id, branchData.tenantId);
  if (branch) {
    return branch;
  }

  branch = new Branch();
  Object.assign(branch, branchData);

  logSuccess(`+ Seed Branch [#${branch.id}] ${branch.name}`, 4, isDebug);
  return await branchRepository.save(branch);
};

/**
 * Get a list with details for the demo Branches we want to seed
 * We have a set with some static branches and a bunch of automatically generated random ones
 *
 * @returns {BranchDto[]}
 */
export const generateBranchesSeedData = (): BranchDto[] => {
  const generatedDemoBranches: BranchDto[] = generateBranchesDemoSeedData();

  return [...generatedDemoBranches, ...STATIC_BRANCHES];
};

/**
 * Generate some seed Branches data for the available tenants
 *
 * @returns {BranchDto[]} - Generated details for Branches
 */
export const generateBranchesDemoSeedData = (): BranchDto[] => {
  const maxBranches = 5;

  const branchData: BranchDto[] = [];

  tenantData.forEach(({id: tenantId}) => {
    for (let i = 1; i <= maxBranches; i++) {
      // TODO: Move out the generation of a single Branch in a separate function
      const randomNumber = getRandomIntIndex(DEMO_LOCATION_NAMES.length);
      branchData.push({
        id: intGuid(i + 1, tenantId),
        tenantId,
        name: `${DEMO_LOCATION_NAMES[randomNumber]} branch - ${i + 1}`,
        status: getRandomItem(DEMO_BRANCH_STATUSES),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  });

  return branchData;
};
