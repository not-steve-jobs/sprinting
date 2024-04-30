import {Connection} from 'typeorm';

import {UtilsHelper} from 'src/helpers/utils.helper';
import {Invoice} from 'src/modules/invoice/invoice.entity';
import {Location} from 'src/modules/location/location.entity';
import {InvoiceStatus} from 'src/modules/status/status.enum';
import {InvoiceRepository} from 'src/modules/invoice/invoice.repository';
import {InvoiceDto} from 'src/modules/invoice/dto/invoice.dto';

import {SeedFeatures} from 'src/seed/tenantSpecific/data/seedFeatures.data';
import {tenantData} from 'src/seed/tenantSpecific/data/tenant.data';
import {
  intGuid,
  getRandomEntityStatus,
  shouldSeedTenantRelatedData,
  log,
  getLocationsByClient,
  logSuccess,
  isDebugMode,
} from 'src/seed/utils/seed.utils';
import {parseDuePaymentDate, parseDuePaymentDateNegative} from './utils';
import {generateRandomDate, generateRandomInteger, zeroPad} from 'src/seed/utils/helpers';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {UUIDSection} from 'src/seed/utils/uuidSection.enum';

const status = [InvoiceStatus.Issued, InvoiceStatus.Paid];
const locationNames = ['Berlin Tech centerCypress', 'London Tech 1Cypress', 'Madrid Tech 21Cypress'];
const currency = ['EUR', 'PLN'];

/**
 * Generate some demo Invoices data
 * TODO: Refactor the logic for the generation of the Invoices
 *
 * @returns {ContractDto[]} - Generated details for Invoices
 */
export const generateInvoicesSeedData = (): InvoiceDto[] => {
  const invoiceData: InvoiceDto[] = [];

  // TODO: Add the tenantData as input param
  tenantData.forEach((tenant) => {
    const {id: tenantId} = tenant;
    if (!shouldSeedTenantRelatedData(tenant, SeedFeatures.Invoices)) {
      return;
    }
    for (let i = 1; i <= 40; i++) {
      const statusId = getRandomEntityStatus(tenantId, Invoice.name);
      if (i <= 20) {
        const invoiceStandard: any = {
          id: intGuid(tenantId * 10 + i, UUIDSection.Invoices),
          tenantId,
          name: `Test client ${zeroPad(i, 3)}`,
          number: `W912HN-I${zeroPad(i, 3)}-${tenantId}`,
          location: locationNames[Math.floor(UtilsHelper.randomNumber() * locationNames.length)],
          issueDate: `${generateRandomDate(new Date(2012, 0, 1), new Date())}`,
          totalAmount: generateRandomInteger(2000, 200000),
          hoursBilled: generateRandomInteger(20, 900),
          duePaymentDate: `${parseDuePaymentDate(new Date())}`,
          attachments: 'LINK.com',
          statusId,
        };

        if (tenantId !== 110 && tenantId !== 116) {
          invoiceStandard.status = status[Math.floor(UtilsHelper.randomNumber() * status.length)];
        }

        const invoiceLux =
          tenantId === 110
            ? {
                periodStart: `${generateRandomDate(new Date(2012, 0, 1), new Date())}`,
                periodEnd: `${generateRandomDate(new Date(), new Date(2012, 0, 1))}`,
                creditNotes: 'Some notes...',
              }
            : {};

        const invoicePol =
          tenantId === 116
            ? {
                currency: currency[Math.floor(UtilsHelper.randomNumber() * currency.length)],
                amountBeforeTax: generateRandomInteger(1000, 100000),
              }
            : {};

        invoiceData.push({
          ...invoiceStandard,
          ...invoiceLux,
          ...invoicePol,
        });
      }

      if (i > 20) {
        // add invoices for chart week data
        const invoiceStandard: any = {
          id: intGuid(tenantId * 10 + i, UUIDSection.Invoices),
          tenantId,
          name: `Test client ${zeroPad(i, 3)}`,
          number: `W912HN-I${zeroPad(i, 3)}-${tenantId}`,
          location: locationNames[Math.floor(UtilsHelper.randomNumber() * locationNames.length)],
          issueDate: `${generateRandomDate(new Date(2012, 0, 1), new Date())}`,
          totalAmount: generateRandomInteger(2000, 200000),
          hoursBilled: generateRandomInteger(20, 900),
          duePaymentDate: `${parseDuePaymentDateNegative(new Date())}`,
          attachments: 'LINK.com',
          statusId,
        };

        if (tenantId !== 110 && tenantId !== 116) {
          invoiceStandard.status = status[Math.floor(UtilsHelper.randomNumber() * status.length)];
        }

        const invoiceLux =
          tenantId === 110
            ? {
                periodStart: `${generateRandomDate(new Date(2012, 0, 1), new Date())}`,
                periodEnd: `${generateRandomDate(new Date(), new Date(2012, 0, 1))}`,
                creditNotes: 'Some notes...',
              }
            : {};

        const invoicePol =
          tenantId === 116
            ? {
                currency: currency[Math.floor(UtilsHelper.randomNumber() * currency.length)],
                amountBeforeTax: generateRandomInteger(1000, 100000),
              }
            : {};

        invoiceData.push({
          ...invoiceStandard,
          ...invoiceLux,
          ...invoicePol,
        });
      } else if (i > 25) {
        const invoiceStandard: any = {
          id: intGuid(tenantId * 10 + i, UUIDSection.Invoices),
          tenantId,
          name: `Test client ${zeroPad(i, 3)}`,
          number: `W912HN-I${zeroPad(i, 3)}-${tenantId}`,
          location: locationNames[Math.floor(UtilsHelper.randomNumber() * locationNames.length)],
          issueDate: `${generateRandomDate(new Date(2012, 0, 1), new Date())}`,
          totalAmount: generateRandomInteger(2000, 200000),
          hoursBilled: generateRandomInteger(20, 900),
          duePaymentDate: `${parseDuePaymentDate(new Date())}`,
          attachments: 'LINK.com',
          statusId,
        };

        if (tenantId !== 110 && tenantId !== 116) {
          invoiceStandard.status = status[Math.floor(UtilsHelper.randomNumber() * status.length)];
        }

        const invoiceLux =
          tenantId === 110
            ? {
                periodStart: `${generateRandomDate(new Date(2012, 0, 1), new Date())}`,
                periodEnd: `${generateRandomDate(new Date(), new Date(2012, 0, 1))}`,
                creditNotes: 'Some notes...',
              }
            : {};

        const invoicePol =
          tenantId === 116
            ? {
                currency: currency[Math.floor(UtilsHelper.randomNumber() * currency.length)],
                amountBeforeTax: generateRandomInteger(1000, 100000),
              }
            : {};

        invoiceData.push({
          ...invoiceStandard,
          ...invoiceLux,
          ...invoicePol,
        });
      } else if (i > 30) {
        // add invoices for chart month data
        const invoiceStandard: any = {
          id: intGuid(tenantId * 10 + i, UUIDSection.Invoices),
          tenantId,
          name: `Test client ${zeroPad(i, 3)}`,
          number: `W912HN-I${zeroPad(i, 3)}-${tenantId}`,
          location: locationNames[Math.floor(UtilsHelper.randomNumber() * locationNames.length)],
          issueDate: `${generateRandomDate(new Date(2012, 0, 1), new Date())}`,
          totalAmount: generateRandomInteger(2000, 200000),
          hoursBilled: generateRandomInteger(20, 900),
          duePaymentDate: `${parseDuePaymentDateNegative(new Date())}`,
          attachments: 'LINK.com',
          statusId,
        };

        if (tenantId !== 110 && tenantId !== 116) {
          invoiceStandard.status = status[Math.floor(UtilsHelper.randomNumber() * status.length)];
        }

        const invoiceLux =
          tenantId === 110
            ? {
                periodStart: `${generateRandomDate(new Date(2012, 0, 1), new Date())}`,
                periodEnd: `${generateRandomDate(new Date(), new Date(2012, 0, 1))}`,
                creditNotes: 'Some notes...',
              }
            : {};

        const invoicePol =
          tenantId === 116
            ? {
                currency: currency[Math.floor(UtilsHelper.randomNumber() * currency.length)],
                amountBeforeTax: generateRandomInteger(1000, 100000),
              }
            : {};

        invoiceData.push({
          ...invoiceStandard,
          ...invoiceLux,
          ...invoicePol,
        });
      } else if (i > 35) {
        const invoiceStandard: any = {
          id: intGuid(tenantId * 10 + i, UUIDSection.Invoices),
          tenantId,
          name: `Test client ${zeroPad(i, 3)}`,
          number: `W912HN-I${zeroPad(i, 3)}-${tenantId}`,
          location: locationNames[Math.floor(UtilsHelper.randomNumber() * locationNames.length)],
          issueDate: `${generateRandomDate(new Date(2012, 0, 1), new Date())}`,
          totalAmount: generateRandomInteger(2000, 200000),
          hoursBilled: generateRandomInteger(20, 900),
          duePaymentDate: `${parseDuePaymentDateNegative(new Date())}`,
          attachments: 'LINK.com',
          statusId,
        };

        if (tenantId !== 110 && tenantId !== 116) {
          invoiceStandard.status = status[Math.floor(UtilsHelper.randomNumber() * status.length)];
        }

        const invoiceLux =
          tenantId === 110
            ? {
                periodStart: `${generateRandomDate(new Date(2012, 0, 1), new Date())}`,
                periodEnd: `${generateRandomDate(new Date(), new Date(2012, 0, 1))}`,
                creditNotes: 'Some notes...',
              }
            : {};

        const invoicePol =
          tenantId === 116
            ? {
                currency: currency[Math.floor(UtilsHelper.randomNumber() * currency.length)],
                amountBeforeTax: generateRandomInteger(1000, 100000),
              }
            : {};

        invoiceData.push({
          ...invoiceStandard,
          ...invoiceLux,
          ...invoicePol,
        });
      }
    }
  });

  return invoiceData;
};

/**
 * Seed demo data for an Invoice
 * Note: Need a bit more of a refactoring
 * Note: For some reason the locationId in the response is wrong
 *
 * @param {Connection} db - The active connection with the database
 * @param {InvoiceDataDto[]} invoiceData - All of the details for the Invoice
 * @param {Location[]} countries - List with all of the active Locations which should be linked with the Invoices
 * @returns {Promise<Invoice>}
 */
export const seedInvoice = async (db: Connection, invoiceData: InvoiceDto, locations: Location[]): Promise<Invoice> => {
  const isDebug = isDebugMode();
  const invoiceRepository: InvoiceRepository = db.getCustomRepository(InvoiceRepository);

  let invoice: Invoice = await invoiceRepository.findOne(invoiceData.tenantId, invoiceData.id);
  if (invoice) {
    return invoice;
  }

  invoice = new Invoice();
  const locationsForTenantAndClient = getLocationsByClient(locations);
  const randomLocationIndex = Math.floor(UtilsHelper.randomNumber() * (locationsForTenantAndClient.length - 1));
  const randomLocation = locationsForTenantAndClient[randomLocationIndex];

  Object.assign(invoice, invoiceData);
  invoice.locationId = randomLocation?.id;

  logSuccess(`+ Seed Invoice [#${invoice.id}] ${invoice.number}`, 3, isDebug);
  return await invoiceRepository.save(invoice);
};

/**
 * Seed demo data for the Invoices in the system
 * Note: We have to change this to ensure that we have seeded data for all tenant and users
 * Note: This is only refactored a bit, it's obvious that it need some more work in order to polish it
 *
 * @param {Connection} db - The active connection with the database
 * @param {Location[]} countries - List with all of the active Locations
 * @returns {Promise<Invoice[]>} - A list with all of the seeded Contracts
 */
export const seedInvoices = async (db: Connection, locations: Location[]): Promise<Invoice[]> => {
  const invoiceRepository: InvoiceRepository = db.getCustomRepository(InvoiceRepository);

  log('Seeding Invoices');
  const stopwatch = new Stopwatch();

  const invoiceData: InvoiceDto[] = generateInvoicesSeedData();
  const createdInvoices: Invoice[] = await Promise.all(
    invoiceData.map(async (data: InvoiceDto) => {
      return await seedInvoice(db, data, locations);
    }),
  );

  // Note: For some reason the saved Invoices contain wrong locationId and we have to re-fetch them
  const createdInvoicesIds: string[] = createdInvoices.map((invoice) => invoice.id);
  const invoices: Invoice[] = await invoiceRepository.findManyById(createdInvoicesIds);

  stopwatch.stopAndLogElapsedTime(`count: ${createdInvoices.length}`);
  return invoices;
};
