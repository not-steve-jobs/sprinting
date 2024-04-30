import * as dateFns from 'date-fns';
import {Invoice} from 'src/modules/invoice/invoice.entity';
import {Status} from 'src/modules/status/status.entity';
import {
  generateRandomDate,
  generateRandomInteger,
  filterEntitiesByTenantId,
  filterStatusesByEntityName,
} from 'src/seed/utils/helpers';

export const filterInvoicesByTenant = (invoices: Invoice[], tenantId: number): Invoice[] => {
  return filterEntitiesByTenantId<Invoice>(invoices, tenantId);
};

export const filterInvoiceStatuses = (statuses: Status[], tenantId: number): Status[] => {
  return filterStatusesByEntityName(statuses, tenantId, Invoice.name);
};

// Note: The name of this function sounds wrong?
export const parseDuePaymentDate = (date: Date): Date => {
  return generateRandomDate(date, dateFns.setMonth(new Date(), dateFns.getMonth(date) + generateRandomInteger(0, 5)));
};

// Note: The name of this function sounds wrong?
export const parseDuePaymentDateNegative = (date: Date): Date => {
  return generateRandomDate(date, dateFns.setDate(new Date(), dateFns.getDate(date) - generateRandomInteger(1, 10)));
};
