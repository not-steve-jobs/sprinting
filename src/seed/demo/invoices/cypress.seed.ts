import {Connection} from 'typeorm/connection/Connection';

import {Invoice} from 'src/modules/invoice/invoice.entity';
import {Status} from 'src/modules/status/status.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {InvoiceDto} from 'src/modules/invoice/dto/invoice.dto';

import {Stopwatch} from 'src/seed/utils/stopwatch';
import {intGuid, log} from 'src/seed/utils/seed.utils';
import {filterInvoicesByTenant, filterInvoiceStatuses} from './utils';
import {seedInvoice} from './invoice.seed';

export interface SeedCypressInvoiceResources {
  statuses: Status[];
  invoices: Invoice[];
}

/**
 * Seed Invoices for the Cypress user
 * Note: This is not refactored yet, just moved it here for the sake of the better files organization
 * TODO: Refactor this to use seedInvoice and don't clone existing Invoices anymore
 *
 * @param {Connection} db - The active connection with the DB
 * @param {TenantUser} cypressTenantUser - The TenantUser to which we want to associate the Invoices
 * @param {SeedCypressInvoiceResources} resources - All resources required to build up the Invoices
 * @returns {Promise<Invoice[]>}
 */
export const seedCypressInvoices = async (
  db: Connection,
  cypressTenantUser: TenantUser,
  resources: SeedCypressInvoiceResources,
): Promise<Invoice[]> => {
  log(`> Seeding Invoices for Cypress User [${cypressTenantUser.userId}] on Tenant ${cypressTenantUser.tenantId}`, 3);
  const stopwatch = new Stopwatch();

  let invoiceCounter = 1;

  const tenantInvoices: Invoice[] = filterInvoicesByTenant(resources.invoices, cypressTenantUser.tenantId);
  const createdCypressInvoices: Invoice[] = await Promise.all(
    tenantInvoices.map(async (invoiceToClone: Invoice, index: number) => {
      // Temporary we want only one Invoice for every Tenant of the Cypress User
      if (index > 0) {
        return;
      }

      const invoiceStatuses: Status[] = filterInvoiceStatuses(resources.statuses, cypressTenantUser.tenantId);
      const invoiceStatus: Status = invoiceStatuses[0];

      if (!invoiceStatus) {
        return;
      }

      const invoiceId = intGuid(invoiceCounter++, 5000);

      // TODO: Fix the number by generating it in a smarter way when the Invoices module starts to function
      const invoiceToCreate: InvoiceDto = {
        ...invoiceToClone,
        id: invoiceId,
        tenantId: cypressTenantUser.tenantId,
        statusId: invoiceStatus.id,
        number: `${invoiceToClone.number}_${cypressTenantUser.tenantId}_${cypressTenantUser.userId.substring(30)}_${
          invoiceCounter + cypressTenantUser.tenantId + invoiceStatus.id
        }`,
      };

      // delete invoiceToCreate.location;
      // delete invoiceToCreate.status;

      // logSuccess(`+ Seed Invoice #${invoice.id} ${invoice.number}`, 3);
      return await seedInvoice(db, invoiceToCreate, []);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdCypressInvoices.length}`);
  return createdCypressInvoices;
};
