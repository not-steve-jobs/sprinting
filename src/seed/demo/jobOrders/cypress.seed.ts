import {Connection} from 'typeorm';
import * as dateFns from 'date-fns';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {LocationBranch} from 'src/modules/locationBranch/locationBranch.entity';
import {Status} from 'src/modules/status/status.entity';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {TenantUserLocationRepository} from 'src/modules/tenantUserLocation/tenantUserLocation.repository';
import {JobOrderAssociate} from 'src/modules/jobOrderAssociate/jobOrderAssociate.entity';
import {SeedJobOrderDto} from 'src/modules/jobOrder/dto/seedJobOrder.dto';
import {JobOrderStatus} from 'src/modules/status/status.enum';
import {JobOrderLanguage} from 'src/modules/jobOrderLanguage/jobOrderLanguage.entity';
import {JobOrderCertification} from 'src/modules/jobOrderCertification/jobOrderCertification.entity';
import {Certification} from 'src/modules/certification/certification.entity';
import {Level} from 'src/modules/level/level.entity';
import {Language} from 'src/modules/language/language.entity';

import {filterJobOrdersByTenant, findJobOrderStatusByName} from './jobOrder';
import {getJobOrderAssociates} from './jobOrderAssociate';
import {log} from 'src/seed/utils/seed.utils';
import {getTenantUserLocationByTenantIdAndUserId} from '../users/user/utils';
import {getLocationBranchByLocation} from '../locations';
import {seedJobOrder} from './jobOrder';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {seedJobOrderAssociates, seedJobOrderAssociatesForCandidatesPreselectionStatus} from './jobOrderAssociate/seed';
import {CYPRESS_DEMO_ORDER_NAME} from './jobOrder';
import {seedJobOrderLanguages} from './jobOrderLanguage';
import {seedJobOrderCertifications} from './jobOrderCertification';

export interface SeedCypressJobOrderResources {
  statuses: Status[];
  jobOrders: JobOrder[];
  tenantUserLocations: TenantUserLocation[];
  locationBranches: LocationBranch[];
  languages: Language[];
  levels: Level[];
  certifications: Certification[];
}

/**
 * Seed demo Job Orders for the Cypress user
 *
 * @param {Connection} db - The active connection with the database
 * @param {TenantUser} cypressTenantUser - The TenantUser with which we want to associate the seeded JobOrders
 * @param {SeedCypressJobOrderResources} resources - List with all of the resources used to seed the JobOrders and reference with them
 * @returns {JobOrder[]}
 */
export const seedCypressJobOrders = async (
  db: Connection,
  cypressTenantUser: TenantUser,
  resources: SeedCypressJobOrderResources,
): Promise<JobOrder[]> => {
  log(`> Seed Job Orders for User #[${cypressTenantUser.userId}] on Tenant ${cypressTenantUser.tenantId}`, 3);
  const stopwatch = new Stopwatch();

  const cypressJobOrders: JobOrder[] = filterJobOrdersByTenant(resources.jobOrders, cypressTenantUser.tenantId);
  const createdCypressOrders: JobOrder[] = await Promise.all(
    cypressJobOrders.map(async (jobOrderToClone: JobOrder, index: number) => {
      // We want to set some details manually only for the first jobOrder for every Tenant
      // This way we can let the Cypress tests to find it easily
      /// The date is important, we set a date far away in the future with the intension that our JobOrder will be always on the top of the list
      if (index === 0) {
        jobOrderToClone.name = CYPRESS_DEMO_ORDER_NAME;
        jobOrderToClone.numberOfOpenings = 4;
        jobOrderToClone.createdAt = dateFns.parseISO('2025-01-02 03:04:05');
        jobOrderToClone.updatedAt = dateFns.parseISO('2025-01-02 03:04:05');
      }

      const createdJobOrder: JobOrder = await seedCypressJobOrder(db, cypressTenantUser, resources, jobOrderToClone);

      const createdJobOrderLanguages: JobOrderLanguage[] = await seedJobOrderLanguages(
        db,
        createdJobOrder,
        resources.languages,
        resources.levels,
      );
      createdJobOrder.jobOrderLanguage = createdJobOrderLanguages;

      const createdJobOrderCertifications: JobOrderCertification[] = await seedJobOrderCertifications(
        db,
        createdJobOrder,
        resources.certifications,
      );
      createdJobOrder.jobOrderCertification = createdJobOrderCertifications;

      const createdJobOrderAssociates: JobOrderAssociate[] = await seedCypressJobOrderAssociates(
        db,
        createdJobOrder,
        resources,
      );
      createdJobOrder.jobOrderAssociate = createdJobOrderAssociates;

      return createdJobOrder;
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdCypressOrders.length}`);
  return createdCypressOrders;
};

const seedCypressJobOrder = async (
  db: Connection,
  cypressTenantUser: TenantUser,
  resources: SeedCypressJobOrderResources,
  jobOrder: JobOrder,
): Promise<JobOrder> => {
  const tenantUserLocationsRepository: TenantUserLocationRepository = db.getCustomRepository(
    TenantUserLocationRepository,
  );

  // We want to create a completely new JobOrder for the Cypress user
  // Add prefix '1' to mark cloned jobOrders and to make difference to a original jobOrder.
  jobOrder.id = `1${jobOrder.id.substring(1)}`;

  // We use the provided JobOrder as a base, but e want to override some of its properties manually
  jobOrder.clientId = cypressTenantUser.user.clientId;
  jobOrder.userId = cypressTenantUser.userId;

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

  // We want to make sure that the Cypress order will be in a specific Status, so we'll be able to perform tests on it
  let jobOrderStatusId: number = jobOrder.statusId;
  if (jobOrder.name === CYPRESS_DEMO_ORDER_NAME) {
    const jobOrderStatus: Status = findJobOrderStatusByName(
      resources.statuses,
      cypressTenantUser.tenantId,
      JobOrderStatus.Submitted,
    );
    jobOrderStatusId = jobOrderStatus?.id;
  }

  const cypressBranch: LocationBranch = getLocationBranchByLocation(
    resources.locationBranches,
    cypressTenantUser.tenantId,
    cypressTenantUserLocation.locationId,
  );

  const jobOrderToCreate: SeedJobOrderDto = {
    ...jobOrder,
    tenantId: cypressTenantUser.tenantId,
    locationId: cypressTenantUserLocation.locationId,
    branchId: cypressBranch.branchId,
    userId: cypressTenantUser.userId,
    statusId: jobOrderStatusId,
    uploadedFiles: [],
  };

  // logSuccess(`+ Seed Job Order for Cypress User ${jobOrderToCreate.name} [#${jobOrderToCreate.tenantId}]`, 5);
  return await seedJobOrder(db, jobOrderToCreate);
};

/**
 * We have to ensure that our test order has enough linked JobOrderAssociates to fill in the candidates tab and the "See more" button
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrder} jobOrder - The JobOrder to which we want to attach the JobOrderAssociate
 * @param {SeedCypressJobOrderResources} resources - List with all available resources required to build up some JobOrderAssociates
 * @returns {Promise<JobOrderAssociate[]>}
 */
const seedCypressJobOrderAssociates = async (
  db: Connection,
  jobOrder: JobOrder,
  resources: SeedCypressJobOrderResources,
): Promise<JobOrderAssociate[]> => {
  const jobOrderAssociates: JobOrderAssociate[] = await getJobOrderAssociates(db, jobOrder);

  // Limit the amount of the related JobOrderAssociates
  if (jobOrderAssociates.length > 0) {
    return;
  }

  let createdJobOrderAssociates: JobOrderAssociate[] = await seedJobOrderAssociates(db, jobOrder, resources.statuses);

  // For the Cypress order we want to seed additional Candidates in the Select tab
  if (jobOrder.name === CYPRESS_DEMO_ORDER_NAME) {
    const amountOfAdditionalCandidates = jobOrder.numberOfOpenings * 3;
    const additionalJobOrderAssociates: JobOrderAssociate[] = await seedJobOrderAssociatesForCandidatesPreselectionStatus(
      db,
      jobOrder,
      resources.statuses,
      amountOfAdditionalCandidates,
    );

    createdJobOrderAssociates = createdJobOrderAssociates.concat(additionalJobOrderAssociates);
  }

  return createdJobOrderAssociates;
};
