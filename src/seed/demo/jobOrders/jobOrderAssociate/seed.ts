import {Connection} from 'typeorm';
import {UtilsHelper} from 'src/helpers/utils.helper';

import {Status} from 'src/modules/status/status.entity';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {JobOrderAssociate} from 'src/modules/jobOrderAssociate/jobOrderAssociate.entity';
import {isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {SeedJobOrderAssociateDto} from 'src/modules/jobOrderAssociate/dto/seedJobOrderAssociate.dto';
import {JobOrderAssociateRepository} from 'src/modules/jobOrderAssociate/jobOrderAssociate.repository';
import {JobOrderAssociateStatus, JobOrderStatus} from 'src/modules/status/status.enum';

import {getJobOrderAssociates, filterJobOrderAssociateStatusesByName} from './utils';
import {getRandomItem} from 'src/seed/utils/helpers';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {findStatusById} from '../jobOrder';
import {AssociateProperties} from '../../customUsers/utils';

/**
 * Seed demo data for the Job Orders Associates
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrder} jobOrders - List with all of the JobOrder for which we want to generate JobOrderAssociates
 * @param {Status[]} statuses - List with all of the Statuses which we should use in order to generate the candidates
 * @returns {Promise<JobOrderAssociate[]>} - A list with all of the seeded JobOrderAssociates
 */
export const seedJobOrdersAssociates = async (
  db: Connection,
  jobOrders: JobOrder[],
  statuses: Status[],
): Promise<JobOrderAssociate[]> => {
  log('Seeding Job Order Associates', 3);
  const stopwatch = new Stopwatch();

  const jobOrdersAssociates: JobOrderAssociate[][] = [];
  for (const jobOrder of jobOrders) {
    const createdJobOrderAssociates: JobOrderAssociate[] = await seedJobOrderAssociates(db, jobOrder, statuses);
    jobOrdersAssociates.push(createdJobOrderAssociates);
  }

  stopwatch.stopAndLogElapsedTime(`count: ${jobOrdersAssociates.flat().length}`);
  return jobOrdersAssociates.flat();
};

/**
 * We have to ensure that our test order has enough linked JobOrderAssociates to fill in the candidates tab and the "See more" button
 * We seed the candidates according to the Status of the JobOrder
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrder} jobOrder - The JobOrder to which we want to attach the JobOrderAssociate
 * @param {Status[]} statuses - List with all available Statuses used to seed the JobOrderAssociates
 * @returns {Promise<JobOrderAssociate[]>}
 */
export const seedJobOrderAssociates = async (
  db: Connection,
  jobOrder: JobOrder,
  statuses: Status[],
): Promise<JobOrderAssociate[]> => {
  const jobOrderAssociates: JobOrderAssociate[] = await getJobOrderAssociates(db, jobOrder);

  // Limit the amount of the related JobOrderAssociates
  // if (jobOrderAssociates.length >= jobOrder.numberOfOpenings * 3) {
  if (jobOrderAssociates.length > 0) {
    return;
  }

  const createdJobOrderAssociates: JobOrderAssociate[][] = [];

  // TODO: Maybe obtain the statuses from the feature configuration at some point
  // const featureConfiguration = getOrderDetailsListingStatusesFeatureConfiguration(featureConfigurationDataTenantAdeccoSwi);

  const status: Status = findStatusById(statuses, jobOrder.statusId);
  const numberOfCandidates: number = jobOrder.numberOfOpenings / 2;

  switch (status.name) {
    case JobOrderStatus.Submitted:
      // No Candidates available when the order is in Submittal
      break;
    case JobOrderStatus.InProgress:
      createdJobOrderAssociates.push(await seedJobOrderAssociatesForInProgressStatus(db, jobOrder, statuses, 1));
      break;
    case JobOrderStatus.CandidatesPreselection:
      createdJobOrderAssociates.push(
        await seedJobOrderAssociatesForCandidatesPreselectionStatus(db, jobOrder, statuses, numberOfCandidates),
      );
      break;
    case JobOrderStatus.PartiallyCovered:
      createdJobOrderAssociates.push(
        await seedJobOrderAssociatesForPartiallyCoveredStatus(db, jobOrder, statuses, numberOfCandidates),
      );
      break;
    case JobOrderStatus.Covered:
      createdJobOrderAssociates.push(await seedJobOrderAssociatesForCoveredStatus(db, jobOrder, statuses));
      break;
  }

  return createdJobOrderAssociates.flat();
};

/**
 * Seed JobOrderAssociates for JobOrders which are have In Progress status
 * It will seed only one candidate in Application status
 */
const seedJobOrderAssociatesForInProgressStatus = async (
  db: Connection,
  jobOrder: JobOrder,
  statuses: Status[],
  amount: number,
): Promise<JobOrderAssociate[]> => {
  return await seedApplicationJobOrderAssociates(db, jobOrder, statuses, amount);
};

/**
 * Seed JobOrderAssociates for JobOrders which are have In Selection status
 * It will seed a bunch of one candidates in Submittal status which will be shown in the Match tab
 */
export const seedJobOrderAssociatesForCandidatesPreselectionStatus = async (
  db: Connection,
  jobOrder: JobOrder,
  statuses: Status[],
  amount: number,
): Promise<JobOrderAssociate[]> => {
  return await seedSubmittalJobOrderAssociates(db, jobOrder, statuses, amount);
};

/**
 * Seed JobOrderAssociates for JobOrders which are have In Partial status
 * It will seed a bunch of one candidates in Submittal status which will be shown in the Match tab
 * It will seed a bunch of one candidates in PreContract status which will be shown in the Select tab
 */
const seedJobOrderAssociatesForPartiallyCoveredStatus = async (
  db: Connection,
  jobOrder: JobOrder,
  statuses: Status[],
  amount: number,
): Promise<JobOrderAssociate[]> => {
  const createdJobOrderAssociates: JobOrderAssociate[][] = [];

  createdJobOrderAssociates.push(await seedSubmittalJobOrderAssociates(db, jobOrder, statuses, amount));
  createdJobOrderAssociates.push(await seedPreContractJobOrderAssociates(db, jobOrder, statuses, amount));

  return createdJobOrderAssociates.flat();
};

/**
 * Seed JobOrderAssociates for JobOrders which are have Covered status
 * It will seed a bunch of one candidates in Submittal status which will be shown in the Match tab
 * It will seed enough candidates in PreContract status to fill the requested amount of the order
 */
const seedJobOrderAssociatesForCoveredStatus = async (
  db: Connection,
  jobOrder: JobOrder,
  statuses: Status[],
): Promise<JobOrderAssociate[]> => {
  const createdJobOrderAssociates: JobOrderAssociate[][] = [];

  const submittedJobOrderAssociates = await seedSubmittalJobOrderAssociates(
    db,
    jobOrder,
    statuses,
    jobOrder.numberOfOpenings,
  );
  const preContractJobOrderAssociates = await seedPreContractJobOrderAssociates(
    db,
    jobOrder,
    statuses,
    jobOrder.numberOfOpenings,
  );

  createdJobOrderAssociates.push(submittedJobOrderAssociates);
  createdJobOrderAssociates.push(preContractJobOrderAssociates);

  return createdJobOrderAssociates.flat();
};

/**
 * Seed JobOrderAssociates for a specific JobOrder which will be Application status
 */
const seedApplicationJobOrderAssociates = async (
  db: Connection,
  jobOrder: JobOrder,
  statuses: Status[],
  amount: number,
): Promise<JobOrderAssociate[]> => {
  const allowedStatuses = [JobOrderAssociateStatus.Application];
  const submittedJobOrderStatuses: Status[] = filterJobOrderAssociateStatusesByName(
    statuses,
    jobOrder.tenantId,
    allowedStatuses,
  );

  return await seedJobOrderAssociatesByStatus(db, jobOrder, submittedJobOrderStatuses, amount);
};

/**
 * Seed JobOrderAssociates for a specific JobOrder which will be Submittal status
 */
const seedSubmittalJobOrderAssociates = async (
  db: Connection,
  jobOrder: JobOrder,
  statuses: Status[],
  amount: number,
): Promise<JobOrderAssociate[]> => {
  const allowedStatuses = [JobOrderAssociateStatus.Submittal];
  const jobOrderStatuses: Status[] = filterJobOrderAssociateStatusesByName(
    statuses,
    jobOrder.tenantId,
    allowedStatuses,
  );

  return await seedJobOrderAssociatesByStatus(db, jobOrder, jobOrderStatuses, amount);
};

/**
 * Seed JobOrderAssociates for a specific JobOrder which will be PreContract status
 */
const seedPreContractJobOrderAssociates = async (
  db: Connection,
  jobOrder: JobOrder,
  statuses: Status[],
  amount: number,
): Promise<JobOrderAssociate[]> => {
  const allowedStatuses = [JobOrderAssociateStatus.PreContract];
  const jobOrderStatuses: Status[] = filterJobOrderAssociateStatusesByName(
    statuses,
    jobOrder.tenantId,
    allowedStatuses,
  );

  return await seedJobOrderAssociatesByStatus(db, jobOrder, jobOrderStatuses, amount);
};

/**
 * Seed a desired amount of JobOrderAssociates related with a specific JobOrder according to the provided list with Statuses
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrder} jobOrder - The JobOrder to which we want to attach the JobOrderAssociate
 * @param {Status[]} statuses - List with all available statuses from which we have to pick
 * @param {number} amount - The amount of JobOrderAssociates which we want to generate
 * @returns {Promise<JobOrderAssociate[]>}
 */
export const seedJobOrderAssociatesByStatus = async (
  db: Connection,
  jobOrder: JobOrder,
  statuses: Status[],
  amount: number,
): Promise<JobOrderAssociate[]> => {
  const createdJobOrderAssociates: JobOrderAssociate[] = [];

  for (let index = 0; index < amount; index++) {
    const status: Status = getRandomItem(statuses);
    if (!status) {
      return;
    }

    const jobOrderAssociateData: SeedJobOrderAssociateDto = {
      tenantId: jobOrder.tenantId,
      jobOrderId: jobOrder.id,
      statusId: status.id,
      userId: UtilsHelper.dbUuid(),
    };

    const createdJobOrderAssociate: JobOrderAssociate = await seedJobOrderAssociate(db, jobOrderAssociateData);
    createdJobOrderAssociates.push(createdJobOrderAssociate);
  }

  return createdJobOrderAssociates;
};

/**
 * Seed demo data for the Job Orders Associates
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrderAssociateDto} jobOrderAssociateData - List with all the details which have to be seeded for the JobOrderAssociate
 * @returns {Promise<JobOrderAssociate}
 */
export const seedJobOrderAssociate = async (
  db: Connection,
  jobOrderAssociateData: SeedJobOrderAssociateDto,
): Promise<JobOrderAssociate> => {
  const isDebug = isDebugMode();
  const jobOrderAssociateRepository: JobOrderAssociateRepository = db.getCustomRepository(JobOrderAssociateRepository);

  let jobOrderAssociate: JobOrderAssociate = await jobOrderAssociateRepository.findOne(
    jobOrderAssociateData.jobOrderId,
    jobOrderAssociateData.tenantId,
    jobOrderAssociateData.userId,
  );

  if (jobOrderAssociate) {
    return jobOrderAssociate;
  }

  jobOrderAssociate = new JobOrderAssociate();
  Object.assign(jobOrderAssociate, jobOrderAssociateData);

  logSuccess(
    `+ Seed Job Order Associate [#${jobOrderAssociate.userId}] for Order [#${jobOrderAssociate.jobOrderId}] on Tenant [#${jobOrderAssociate.tenantId}]`,
    3,
    isDebug,
  );

  return await jobOrderAssociateRepository.save(jobOrderAssociate);
};

/**
 * Seed Job Orders Associates with specific data.
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrder} jobOrder - Job order to assign associates to
 * @param {AssociateProperties[]} associates - Associate properties for each record
 * @param {Status[]} statuses - All associate statuses for current tenant
 * @returns {Promise<JobOrderAssociate[]>} - Created records
 */
export const seedJobOrderWithSpecificAssociates = async (
  db: Connection,
  jobOrder: JobOrder,
  associates: AssociateProperties[],
  statuses: Status[],
): Promise<JobOrderAssociate[]> => {
  return Promise.all(
    associates.map((associate: AssociateProperties) => {
      return seedJobOrderAssociate(db, {
        tenantId: jobOrder.tenantId,
        jobOrderId: jobOrder.id,
        userId: associate.userId,
        statusId: statuses.find((status) => status.tenantId === jobOrder.tenantId && status.name === associate.status)
          .id,
        rejected: false,
      });
    }),
  );
};
