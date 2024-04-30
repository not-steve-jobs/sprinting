import {Connection} from 'typeorm';
import * as dateFns from 'date-fns';

import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {JobOrderRepository} from 'src/modules/jobOrder/jobOrder.repository';
import {Status} from 'src/modules/status/status.entity';
import {Location} from 'src/modules/location/location.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {SeedJobOrderDto} from 'src/modules/jobOrder/dto/seedJobOrder.dto';
import {ServiceType} from 'src/modules/serviceType/serviceType.entity';
import {getRandomItem} from 'src/seed/utils/helpers';
import {Shift} from 'src/modules/shift/shift.entity';
import {Rate} from 'src/modules/rate/rate.entity';
import {Type} from 'src/modules/type/type.entity';
import {JobRole} from 'src/modules/jobRole/jobRole.entity';
import {LocationBranch} from 'src/modules/locationBranch/locationBranch.entity';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {Client} from 'src/modules/client/client.entity';
import {EmploymentType} from 'src/modules/employmentType/employmentType.entity';
import {Level} from 'src/modules/level/level.entity';
import {LevelEntityEnum} from 'src/modules/level/level.enum';
import {WorkType} from 'src/modules/workType/workType.entity';
import {JobContactDto} from 'src/modules/tenantUserPermission/dto/jobContact.dto';
import {Tenant} from 'src/modules/tenant/tenant.entity';

import {shouldSeedTenantRelatedData, log, logSuccess, isDebugMode, intGuid} from 'src/seed/utils/seed.utils';
import {tenantData} from 'src/seed/tenantSpecific/data/tenant.data';
import {SeedFeatures} from 'src/seed/tenantSpecific/data/seedFeatures.data';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {
  DEMO_DAYS_IN_WEEK,
  DEMO_END_DATES,
  DEMO_JOB_ORDER_NAMES,
  DEMO_NUMBER_OF_OPENINGS,
  DEMO_SALARIES,
  DEMO_START_DATES,
} from './data';
import {SeedJobOrderResources} from '../seed';
import {
  filterContractTypesByTenant,
  filterEmploymentTypesByTenant,
  filterJobOrderStatuses,
  filterJobRolesByTenant,
  filterLocationsByClientAndUser,
  filterRatesByTenant,
  filterServiceTypesByTenant,
  filterShiftsByTenant,
  filterTenantUsersByTenantAndClient,
  filterWorkTypesByTenant,
} from './utils';
import {getLocationBranchesByLocation} from '../../locations';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {filterClientsByCountry} from '../../clients';
import {filterBillToJobContacts, filterReportToJobContacts, filterTimeSheetApproverJobContacts} from '../../users/';
import {filterLevelByEntity} from '../jobOrderLanguage';

// TODO: I know it's global and is wrong, but for now this is what we have
let jobOrderIdCounter = 0;

/**
 * Seed demo data for the Job Orders
 * Note: Seed cancelled JobOrders
 *
 * @param {Connection} db - The active connection with the database
 * @param {SeedJobOrderResources} resources - List with all of the resources used to seed the JobOrders and reference with them
 * @returns {Promise<JobOrder[]>} - A list with all of the seeded JobOrders
 */
export const seedJobOrdersData = async (db: Connection, resources: SeedJobOrderResources): Promise<JobOrder[]> => {
  log('Seeding Job Orders', 3);
  const stopwatch = new Stopwatch();

  const jobOrderRawData: SeedJobOrderDto[] = await generateJobOrdersData(resources);
  const createdJobOrders: JobOrder[] = await Promise.all(
    jobOrderRawData.map(async (data: SeedJobOrderDto) => {
      return await seedJobOrder(db, data);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdJobOrders.length}`);
  return createdJobOrders;
};

/**
 * Seed demo data for a Job Order
 *
 * @param {Connection} db - The active connection with the database
 * @param {SeedJobOrderDto} jobOrderData - All of the details for the JobOrder which should be created
 * @returns {Promise<JobOrder>}
 */
export const seedJobOrder = async (db: Connection, jobOrderData: SeedJobOrderDto): Promise<JobOrder> => {
  const isDebug = isDebugMode();
  const jobOrderRepository: JobOrderRepository = db.getCustomRepository(JobOrderRepository);

  let jobOrder: JobOrder = await jobOrderRepository.findOneById(jobOrderData.id);
  if (jobOrder) {
    return jobOrder;
  }

  jobOrder = new JobOrder();
  Object.assign(jobOrder, jobOrderData);

  logSuccess(
    `+ Seed Job Order [#${jobOrderData.id}] for User [#${jobOrder.userId}] on Tenant [#${jobOrder.tenantId}]`,
    3,
    isDebug,
  );
  return jobOrderRepository.save(jobOrder);
};

/**
 * Generate a list with demo dummy JobOrders
 *
 * @param {SeedJobOrderResources} resources - All of the related resources required to build a JobOrder
 * @returns {SeedJobOrderDto[]} - List with demo JobOrders
 */
export const generateJobOrdersData = async (resources: SeedJobOrderResources): Promise<SeedJobOrderDto[]> => {
  // TODO: Change tenantData to be input param instead of global variable
  const jobOrderData: SeedJobOrderDto[][] = await Promise.all(
    tenantData.map(async (tenant) => {
      return generateJobOrdersDataByTenant(tenant, resources);
    }),
  );

  return jobOrderData.flat().filter((jobOrder) => jobOrder);
};

/**
 * Generate demo data for the JobOrder for a specific Tenant
 *
 * @param {Tenant} tenant - Information for the Tenant
 * @param {SeedJobOrderResources} resources - All of the related resources required to build a JobOrder
 * @returns {SeedJobOrderDto[]} - List with demo JobOrders
 */
const generateJobOrdersDataByTenant = async (
  tenant: Tenant,
  {
    statuses,
    locationBranches,
    clients,
    tenantUsers,
    locations,
    tenantUserLocations,
    shifts,
    rates,
    types,
    jobRoles,
    employmentTypes,
    levels,
    workTypes,
    tenantUserPermissionService,
    serviceTypes,
  }: SeedJobOrderResources,
): Promise<SeedJobOrderDto[]> => {
  const {id: tenantId, countryId: tenantCountryId} = tenant;
  if (!shouldSeedTenantRelatedData(tenant, SeedFeatures.StaffingRequests)) {
    return;
  }

  const tenantClients: Client[] = filterClientsByCountry(clients, tenantCountryId);
  const tenantShifts: Shift[] = filterShiftsByTenant(shifts, tenantId);
  const tenantRates: Rate[] = filterRatesByTenant(rates, tenantId);
  const tenantContractTypes: Type[] = filterContractTypesByTenant(types, tenantId);
  const tenantJobRoles: JobRole[] = filterJobRolesByTenant(jobRoles, tenantId);
  const tenantJobOrderStatuses: Status[] = filterJobOrderStatuses(statuses, tenantId);
  const tenantEmploymentTypes: EmploymentType[] = filterEmploymentTypesByTenant(employmentTypes, tenantId);
  const tenantWorkTypes: EmploymentType[] = filterWorkTypesByTenant(workTypes, tenantId);
  const experienceLevels: Level[] = filterLevelByEntity(levels, LevelEntityEnum.Experience);
  const tenantServiceTypes: ServiceType[] = filterServiceTypesByTenant(serviceTypes, tenantId);

  const tenantJobContacts: JobContactDto[] = await tenantUserPermissionService.getAvailableJobContacts(tenantId);
  const timeSheetApproverContacts: JobContactDto[] = filterTimeSheetApproverJobContacts(tenantJobContacts);
  const billToContacts: JobContactDto[] = filterBillToJobContacts(tenantJobContacts);
  const reportToContacts: JobContactDto[] = filterReportToJobContacts(tenantJobContacts);

  const clientJobOrders: SeedJobOrderDto[][] = await Promise.all(
    tenantClients.map(({id: clientId}) => {
      const jobOrderResources: GenerateJobOrderResources = {
        tenantUsers: tenantUsers,
        statuses: tenantJobOrderStatuses,
        shifts: tenantShifts,
        rates: tenantRates,
        types: tenantContractTypes,
        jobRoles: tenantJobRoles,
        employmentTypes: tenantEmploymentTypes,
        workTypes: tenantWorkTypes,
        serviceTypes: tenantServiceTypes,
        experienceLevels,
        locations,
        tenantUserLocations,
        locationBranches,
        timeSheetApproverContacts,
        billToContacts,
        reportToContacts,
      };

      return generateJobOrdersDataByClient(tenantId, clientId, jobOrderResources);
    }),
  );

  return clientJobOrders.flat();
};

/**
 * Generate demo data for the JobOrder for a specific Client
 *
 * @param {number} tenantId - The ID of the Tenant
 * @param {string} clientId - The ID of the Client
 * @param {GenerateJobOrderResources} resources - All of the related resources required to build a JobOrder
 * @returns {SeedJobOrderDto[]} - List with demo JobOrders
 */
const generateJobOrdersDataByClient = async (
  tenantId: number,
  clientId: string,
  resources: GenerateJobOrderResources,
): Promise<SeedJobOrderDto[]> => {
  const noOfJobOrders = 9;

  const clientTenantUsers: TenantUser[] = filterTenantUsersByTenantAndClient(resources.tenantUsers, tenantId, clientId);
  if (clientTenantUsers.length === 0) {
    return;
  }

  resources.tenantUsers = clientTenantUsers;

  const generatedClientJobOrders: SeedJobOrderDto[] = [];
  for (let i = 0; i < noOfJobOrders; i++) {
    const jobOrder: SeedJobOrderDto = generateJobOrderData(tenantId, clientId, resources);
    jobOrder.id = intGuid(++jobOrderIdCounter);
    jobOrder.name += ` ${i + 1}`;

    generatedClientJobOrders.push(jobOrder);
  }

  return generatedClientJobOrders;
};

export interface GenerateJobOrderResources {
  statuses: Status[];
  locationBranches: LocationBranch[];
  tenantUsers: TenantUser[];
  locations: Location[];
  tenantUserLocations: TenantUserLocation[];
  shifts: Shift[];
  rates: Rate[];
  types: Type[];
  jobRoles: JobRole[];
  serviceTypes: ServiceType[];
  employmentTypes: EmploymentType[];
  experienceLevels: Level[];
  workTypes: WorkType[];
  timeSheetApproverContacts: JobContactDto[];
  billToContacts: JobContactDto[];
  reportToContacts: JobContactDto[];
}

/**
 * Generate a random data for a JobOrder by a given set of information
 *
 * @param {number} tenantId - The ID of the Tenant for which we want to generate data
 * @param {string} clientId - The Client to which the Tenant belongs
 * @param {SeedJobOrderDto} resources - ll of the resources which should be used to create the external references for the JobOrder
 * @returns {SeedJobOrderDto}
 */
export const generateJobOrderData = (
  tenantId: number,
  clientId: string,
  {
    statuses,
    locationBranches,
    tenantUsers,
    locations,
    tenantUserLocations,
    shifts,
    rates,
    types,
    jobRoles,
    serviceTypes,
    employmentTypes,
    experienceLevels,
    workTypes,
    timeSheetApproverContacts,
    billToContacts,
    reportToContacts,
  }: GenerateJobOrderResources,
): SeedJobOrderDto => {
  const tenantUser: TenantUser = getRandomItem(tenantUsers);
  const status: Status = getRandomItem(statuses);
  const serviceType: ServiceType = getRandomItem(serviceTypes);
  const shift: Shift = getRandomItem(shifts);
  const rate: Rate = getRandomItem(rates);
  const contractType: Type = getRandomItem(types);
  const jobRole: JobRole = getRandomItem(jobRoles);
  const employmentType: EmploymentType = getRandomItem(employmentTypes);
  const workType: WorkType = getRandomItem(workTypes);
  const experience: Level = getRandomItem(experienceLevels);
  const timeSheetApproverContact: JobContactDto = getRandomItem(timeSheetApproverContacts);
  const billToContact: JobContactDto = getRandomItem(billToContacts);
  const reportToContact: JobContactDto = getRandomItem(reportToContacts);
  const dateStart: Date = dateFns.parseISO(getRandomItem(DEMO_START_DATES));
  const dateEnd: Date = dateFns.parseISO(getRandomItem(DEMO_END_DATES));
  const startTime: string = dateFns.format(dateFns.parseISO(getRandomItem(DEMO_START_DATES)), 'HH:mm:ss');
  const endTime: string = dateFns.format(dateFns.parseISO(getRandomItem(DEMO_END_DATES)), 'HH:mm:ss');
  const submissionDate: Date = dateFns.subDays(dateStart, 5);

  const clientLocations: Location[] = filterLocationsByClientAndUser(
    clientId,
    tenantUser,
    locations,
    tenantUserLocations,
  );
  const location: Location = getRandomItem(clientLocations);

  const branchesByLocation: LocationBranch[] = getLocationBranchesByLocation(locationBranches, tenantId, location?.id);
  const locationBranch: LocationBranch = getRandomItem(branchesByLocation);

  return {
    id: UtilsHelper.dbUuid(),
    tenantId,
    userId: tenantUser.userId,
    clientId,
    name: getRandomItem(DEMO_JOB_ORDER_NAMES),
    locationId: location?.id,
    branchId: locationBranch?.branchId,
    statusId: status?.id,
    serviceTypeId: serviceType?.id,
    shiftId: shift?.id,
    rateId: rate?.id,
    employmentTypeId: employmentType?.id,
    contractTypeId: contractType?.id,
    jobRoleId: jobRole?.id,
    submissionDate,
    dateStart,
    dateEnd,
    startTime,
    endTime,
    numberOfOpenings: getRandomItem(DEMO_NUMBER_OF_OPENINGS),
    salary: getRandomItem(DEMO_SALARIES),
    salaryHigh: getRandomItem(DEMO_SALARIES) + 100000,
    jobDescription: `Job order description`, // Note: Make this text dynamic
    additionalInformation: `Additional Information`, // Note: Make this text dynamic
    interviewRequired: false,
    daysInWeek: getRandomItem(DEMO_DAYS_IN_WEEK),
    dayOneGuidance: 'Day one guidance', // Note: Make this text dynamic
    rejected: false,
    experienceId: experience?.id,
    workTypeId: workType?.id,
    timeSheetApproverId: timeSheetApproverContact?.id,
    reportToId: reportToContact?.id,
    billToId: billToContact?.id,

    uploadedFiles: [], // Note: Leaving this blank for now
    jobOrderLanguage: [], // Note: This is a One-to-Many relation, so it's seeded later
    jobOrderCertification: [], // Note: This is a One-to-Many relation, so it's seeded later

    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
