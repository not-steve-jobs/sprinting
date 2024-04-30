import {Connection} from 'typeorm';

import {CloseReasonArguments} from 'src/modules/closeReasonArguments/closeReasonArguments.entity';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {CloseReasonArgumentsRepository} from 'src/modules/closeReasonArguments/closeReasonArguments.repository';
import {Status} from 'src/modules/status/status.entity';
import {CloseReason} from 'src/modules/closeReason/closeReason.entity';

import {isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {getRandomItem} from 'src/seed/utils/helpers';
import {filterCancelledJobOrders, filterCloseReasonsByTenant} from './utils';

export const seedCancelledJobOrdersDetails = async (
  db: Connection,
  jobOrders: JobOrder[],
  statuses: Status[],
  closeReasons: CloseReason[],
): Promise<CloseReasonArguments[]> => {
  log('Seeding Job Order Close Reasons', 3);
  const stopwatch = new Stopwatch();

  const cancelledJobOrder: JobOrder[] = filterCancelledJobOrders(jobOrders, statuses);

  const jobOrdersCloseReasonArguments: CloseReasonArguments[] = [];
  for (const jobOrder of cancelledJobOrder) {
    const createdJobOrdersCloseReasonArguments: CloseReasonArguments = await seedCancelledJobOrderDetails(
      db,
      jobOrder,
      closeReasons,
    );
    jobOrdersCloseReasonArguments.push(createdJobOrdersCloseReasonArguments);
  }

  stopwatch.stopAndLogElapsedTime(`count: ${jobOrdersCloseReasonArguments.flat().length}`);
  return jobOrdersCloseReasonArguments.flat();
};

export const seedCancelledJobOrderDetails = async (
  db: Connection,
  jobOrder: JobOrder,
  closeReasons: CloseReason[],
): Promise<CloseReasonArguments> => {
  const isDebug = isDebugMode();
  const closeReasonArgumentsRepository: CloseReasonArgumentsRepository = db.getCustomRepository(
    CloseReasonArgumentsRepository,
  );

  const jobOrderCloseReasonArguments: CloseReasonArguments = await closeReasonArgumentsRepository.findOne(
    jobOrder.tenantId,
    jobOrder.id,
  );
  if (jobOrderCloseReasonArguments) {
    return jobOrderCloseReasonArguments;
  }

  const tenantCloseReasons: CloseReason[] = filterCloseReasonsByTenant(closeReasons, jobOrder.tenantId);
  const closeReason: CloseReason = getRandomItem(tenantCloseReasons);

  const closeReasonArgumentsData = {
    tenantId: jobOrder.tenantId,
    jobOrderId: jobOrder.id,
    closeReasonId: closeReason.id,
    closedBy: jobOrder.userId,
    comment: 'Test comment',
  };

  const closeReasonArguments = new CloseReasonArguments(closeReasonArgumentsData);

  logSuccess(`+ Seed CloseReasonArguments for JobOrder [#${closeReasonArguments.jobOrderId}]`, 4, isDebug);
  return closeReasonArgumentsRepository.save(closeReasonArguments);
};
