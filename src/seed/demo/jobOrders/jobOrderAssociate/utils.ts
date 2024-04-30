import {Connection} from 'typeorm';

import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {JobOrderRepository} from 'src/modules/jobOrder/jobOrder.repository';
import {JobOrderAssociate} from 'src/modules/jobOrderAssociate/jobOrderAssociate.entity';
import {Status} from 'src/modules/status/status.entity';

import {filterStatusesByEntityName} from 'src/seed/utils/helpers';

/**
 * Filter out the Statuses for the JobOrderAssociates which belongs to a specific Tenant
 *
 * @param {Status[]} statuses - List with all of the Statuses which should be iterated
 * @param {number} tenantId - The Tenant ID which should be used to filter out the Statuses
 */
export const filterJobOrderAssociateStatuses = (statuses: Status[], tenantId: number): Status[] => {
  return filterStatusesByEntityName(statuses, tenantId, JobOrderAssociate.name);
};

export const filterJobOrderAssociateStatusesByName = (
  statuses: Status[],
  tenantId: number,
  statusNames: string[],
): Status[] => {
  const jobOrderAssociateStatuses: Status[] = filterJobOrderAssociateStatuses(statuses, tenantId);
  return jobOrderAssociateStatuses.filter((status) => statusNames.includes(status.name));
};

export const getJobOrderAssociates = async (db: Connection, jobOrder: JobOrder): Promise<JobOrderAssociate[]> => {
  const jobOrderRepository: JobOrderRepository = db.getCustomRepository(JobOrderRepository);
  const jobOrderDetails: JobOrder = await jobOrderRepository.findOne(
    jobOrder.tenantId,
    jobOrder.id,
    false,
    false,
    false,
    ['jobOrderAssociate'],
  );

  return jobOrderDetails.jobOrderAssociate;
};

export const getJobOrdersAssociates = async (db: Connection, jobOrders: JobOrder[]): Promise<JobOrderAssociate[]> => {
  const allJobOrderAssociates: JobOrderAssociate[][] = await Promise.all(
    jobOrders.map(async (jobOrder: JobOrder) => {
      return await getJobOrderAssociates(db, jobOrder);
    }),
  );

  return allJobOrderAssociates.flat();
};

/**
 * Filter out the JobOrders without JobOrderAssociates
 * Because of the nature of the filter function we can't use it directly with async and we do such mapping
 *
 * @param {Connection} db - The active connection with the DB
 * @param {JobOrder[]} jobOrders - The list with JobOrders we want to filter out
 * @returns {Promise<JobOrder[]>}
 */
export const getJobOrdersWithoutAssociates = async (db: Connection, jobOrders: JobOrder[]): Promise<JobOrder[]> => {
  const jobOrderRepository: JobOrderRepository = db.getCustomRepository(JobOrderRepository);
  return jobOrderRepository.getJobOrdersWithoutAssociates(jobOrders);
};
