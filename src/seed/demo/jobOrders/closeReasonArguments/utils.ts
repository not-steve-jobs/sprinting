import {CloseReason} from 'src/modules/closeReason/closeReason.entity';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {Status} from 'src/modules/status/status.entity';
import {JobOrderStatus} from 'src/modules/status/status.enum';
import {filterEntitiesByTenantId} from 'src/seed/utils/helpers';

import {filterJobOrdersByStatus} from '../jobOrder';

export const filterCloseReasonsByTenant = (closeReasons: CloseReason[], tenantId: number): CloseReason[] => {
  return filterEntitiesByTenantId<CloseReason>(closeReasons, tenantId);
};

export const filterCancelledJobOrderStatuses = (statuses: Status[]): Status[] => {
  const cancelledStatusNames: string[] = [JobOrderStatus.CanceledByTheClient, JobOrderStatus.CancelledByAdecco];

  return statuses.filter((status) => {
    return cancelledStatusNames.includes(status.name);
  });
};

export const filterCancelledJobOrders = (jobOrders: JobOrder[], statuses: Status[]): JobOrder[] => {
  const closedJobOrderStatuses: Status[] = filterCancelledJobOrderStatuses(statuses);
  const closedJobOrders: JobOrder[] = filterJobOrdersByStatus(jobOrders, closedJobOrderStatuses);

  return closedJobOrders;
};
