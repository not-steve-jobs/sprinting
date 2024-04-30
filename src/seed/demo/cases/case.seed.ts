import {Connection} from 'typeorm';

import {Case} from 'src/modules/case/case.entity';
import {Client} from 'src/modules/client/client.entity';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {CaseDto} from 'src/modules/case/dto/case.dto';
import {Contract} from 'src/modules/contract/contract.entity';
import {Invoice} from 'src/modules/invoice/invoice.entity';
import {Status} from 'src/modules/status/status.entity';
import {Location} from 'src/modules/location/location.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {CaseRepository} from 'src/modules/case/case.repository';
import {Tenant} from 'src/modules/tenant/tenant.entity';

import {intGuid, getRandomIntIndex, log, logSuccess, isDebugMode} from 'src/seed/utils/seed.utils';
import {tenantData} from 'src/seed/tenantSpecific/data/tenant.data';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {getRandomItem} from 'src/seed/utils/helpers';
import {UUIDSection} from 'src/seed/utils/uuidSection.enum';
import {
  CaseEntity,
  filterCaseStatusesByTenant,
  filterContractsByTenant,
  getRandomCaseEntity,
  filterTenantUsersByTenant,
} from './utils';

import {getRandomLocationByClient} from '../locations';
import {filterInvoicesByTenant} from '../invoices';
import {filterJobOrdersByTenant} from '../jobOrders';
import {getRandomClientByCountry} from '../clients/client';
import {DEMO_DESCRIPTIONS, DEMO_SUBJECTS} from './data';

// TODO: I know it's global and is wrong, but for now this is what we have
let caseIdCounter = 0;

export interface SeedCaseResources {
  clients: Client[];
  locations: Location[];
  statuses: Status[];
  jobOrders: JobOrder[];
  contracts: Contract[];
  invoices: Invoice[];
  tenantUsers: TenantUser[];
  tenantUserLocations: TenantUserLocation[];
}

/**
 * Seed demo data for the Cases in the system
 *
 * @param {Connection} db - The active connection with the database
 * @param {SeedCaseResources} resources - List with all of the resources which should be used in order to build the demo Cases
 * @returns {Promise<Case[]>} - A list with all of the seeded Cases and details for them
 */
export const seedCases = async (db: Connection, resources: SeedCaseResources): Promise<Case[]> => {
  log('Seeding Cases');
  const stopwatch = new Stopwatch();

  const casesData: CaseDto[] = await generateCasesData(resources);
  const createdCases: Case[] = await Promise.all(
    casesData.map(async (data: CaseDto) => {
      return await seedCase(db, data);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdCases.length}`);
  return createdCases;
};

/**
 * Seed a new Case record to the database
 * If the Case already exist, simply return the reference, don't override it
 *
 * @param {Connection} db - The active connection with the database
 * @param {CaseDto} caseData - Data for the new Case which have to be created
 * @returns {Promise<Case>} - The Case record with all the related data
 */
export const seedCase = async (db: Connection, caseData: CaseDto): Promise<Case> => {
  const isDebug = isDebugMode();
  const caseRepository = db.getCustomRepository(CaseRepository);

  let caseRecord: Case = await caseRepository.findOne(caseData.tenantId, caseData.id);
  if (caseRecord) {
    return caseRecord;
  }

  caseRecord = new Case();
  Object.assign(caseRecord, caseData);

  logSuccess(`+ Seed Case [#${caseRecord.id}] ${caseRecord.subject}`, 3, isDebug);
  return caseRepository.save(caseRecord);
};

/**
 * Generate demo dummy data for Cases
 *
 * @param {SeedCaseResources} resources - All of the related references which are required in order build a Case record
 * @returns {CaseDto[]} - List with the generated Cases data ready to be seeded
 */
export const generateCasesData = async (resources: SeedCaseResources): Promise<CaseDto[]> => {
  const casesPerTenant = 3;

  // TODO: Obtain the tenantData as input, not as global
  const casesData: CaseDto[][] = await Promise.all(
    tenantData.map(async (tenant: Tenant) => {
      const contractsForTenant: Contract[] = filterContractsByTenant(resources.contracts, tenant.id);
      const invoicesForTenant: Invoice[] = filterInvoicesByTenant(resources.invoices, tenant.id);
      const jobOrdersForTenant: JobOrder[] = filterJobOrdersByTenant(resources.jobOrders, tenant.id);
      const caseStatuses: Status[] = filterCaseStatusesByTenant(resources.statuses, tenant.id);
      const tenantUsers: TenantUser[] = filterTenantUsersByTenant(resources.tenantUsers, tenant.id);

      const caseResources: SeedCaseResources = {
        clients: resources.clients,
        locations: resources.locations,
        tenantUserLocations: resources.tenantUserLocations,
        tenantUsers: tenantUsers,
        contracts: contractsForTenant,
        invoices: invoicesForTenant,
        jobOrders: jobOrdersForTenant,
        statuses: caseStatuses,
      };

      const tenantUsersCases: CaseDto[][] = await Promise.all(
        tenantUsers.map((tenantUser) => {
          const tenantUserCases: CaseDto[] = [];

          for (let i = 0; i < casesPerTenant; i++) {
            tenantUserCases.push(generateCaseData(tenantUser, tenant.countryId, caseResources));
          }

          return tenantUserCases;
        }),
      );

      return tenantUsersCases.flat();
    }),
  );

  return casesData.flat();
};

/**
 * Generate demo dummy data for a Case
 *
 * @param {TenantUser} tenantUser - Information for the TenantUser for which we want to generate the Case
 * @param {string} countryId - Information for the Country of the Tenant used to get a Location
 * @param {SeedCaseResources} resources - All of the related references which are required in order build a Case record
 * @returns {CaseDto}
 */
export const generateCaseData = (tenantUser: TenantUser, countryId: string, resources: SeedCaseResources): CaseDto => {
  const client: Client = getRandomClientByCountry(resources.clients, countryId);
  if (!client) {
    return;
  }

  const location: Location = getRandomLocationByClient(resources.locations, client.id);
  const status: Status = getRandomItem(resources.statuses);

  const caseEntity: CaseEntity = getRandomCaseEntity(resources.contracts, resources.invoices, resources.jobOrders);

  return {
    id: intGuid(tenantUser.tenantId * 10 + ++caseIdCounter, UUIDSection.Cases),
    tenantId: tenantUser.tenantId,
    userId: tenantUser.userId,
    subject: getRandomItem(DEMO_SUBJECTS),
    description: getRandomItem(DEMO_DESCRIPTIONS),
    statusId: status?.id,
    entityId: caseEntity.entity?.id,
    entityName: caseEntity.entityName,
    caseCategoryId: getRandomIntIndex(4, 1),
    locationId: location.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
