import {Connection} from 'typeorm';

import {LocationBranch} from 'src/modules/locationBranch/locationBranch.entity';
import {UserConsentService} from 'src/modules/userConsent/userConsent.service';
import {Client} from 'src/modules/client/client.entity';
import {Location} from 'src/modules/location/location.entity';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {CountryRepository} from 'src/modules/country/country.repository';
import {PermissionRepository} from 'src/modules/permission/permission.repository';
import {StatusRepository} from 'src/modules/status/status.repository';
import {Country} from 'src/modules/country/country.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {Permission} from 'src/modules/permission/permission.entity';
import {ShiftRepository} from 'src/modules/shift/shift.repository';
import {Shift} from 'src/modules/shift/shift.entity';
import {Rate} from 'src/modules/rate/rate.entity';
import {RateRepository} from 'src/modules/rate/rate.repository';
import {Type} from 'src/modules/type/type.entity';
import {TypeRepository} from 'src/modules/type/type.repository';
import {JobRoleRepository} from 'src/modules/jobRole/jobRole.repository';
import {JobRole} from 'src/modules/jobRole/jobRole.entity';
import {EmploymentType} from 'src/modules/employmentType/employmentType.entity';
import {EmploymentTypeRepository} from 'src/modules/employmentType/employmentType.repository';
import {Language} from 'src/modules/language/language.entity';
import {Certification} from 'src/modules/certification/certification.entity';
import {LanguageRepository} from 'src/modules/language/language.repository';
import {CertificationRepository} from 'src/modules/certification/certification.repository';
import {Level} from 'src/modules/level/level.entity';
import {LevelRepository} from 'src/modules/level/level.repository';
import {WorkType} from 'src/modules/workType/workType.entity';
import {WorkTypeRepository} from 'src/modules/workType/workType.repository';
import {TenantUserPermissionService} from 'src/modules/tenantUserPermission/tenantUserPermission.service';
import {User} from 'src/modules/user/user.entity';
import {Status} from 'src/modules/status/status.entity';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {Contract} from 'src/modules/contract/contract.entity';
import {Invoice} from 'src/modules/invoice/invoice.entity';
import {Branch} from 'src/modules/branch/branch.entity';
import {Workplace} from 'src/modules/workplace/workplace.entity';
import {Case} from 'src/modules/case/case.entity';
import {CloseReason} from 'src/modules/closeReason/closeReason.entity';
import {CloseReasonRepository} from 'src/modules/closeReason/closeReason.repository';

import {seedContracts} from './contracts';
import {seedLocations} from './locations';
import {seedBranches, SeedBranchesResponse} from './locations';
import {SeedCaseResources, seedCases} from './cases';
import {seedInvoices} from './invoices';
import {seedCypressUser, SeedCypressUserResources, SeedUserResources, SeedUserResponse, seedUsers} from './users/seed';
import {SeedCustomUserResources, seedCustomUsers} from './customUsers/utils';
import {SeedClientResponse, seedClients} from './clients/seed';
import {Stopwatch} from '../utils/stopwatch';
import {SeedJobOrderResources, SeedJobOrderResponse, seedJobOrders} from './jobOrders/seed';
import {seedWorkplaces} from './locations';
import {getDemoUsersEmails} from './customUsers/utils';
import {LevelEntityEnum} from 'src/modules/level/level.enum';
import {TenantUserRepository} from 'src/modules/tenantUser/tenantUser.repository';
import {filterLevelByEntity} from './jobOrders/jobOrderLanguage/utils';
import {ServiceTypeRepository} from 'src/modules/serviceType/serviceType.repository';
import {ServiceType} from 'src/modules/serviceType/serviceType.entity';

export interface DemoSeedServices {
  // Used to accept consents for the Cypress users
  userConsentService: UserConsentService;

  // Used to fetch JobContact users for the USA JobOrders
  tenantUserPermissionService: TenantUserPermissionService;
}

/**
 * Seed data used for DEMO purposes, i.e. creating some dummy data to showcase the system
 * Includes data related with the Users, Job Orders, Cases, Invoices, etc
 *
 * @param {Connection} db - The active connection used for the communication with the DB
 * @param {DemoSeedServices} services - The services which are used by some of the seeders
 * @returns - A simple promise to ensure that all of the action have been dispatched
 */
export async function demoSeed(db: Connection, services: DemoSeedServices) {
  console.log(`Seeding Demo Data`);
  const stopwatch = new Stopwatch(1);

  const demoSeeder = new DemoSeeder(db, services);
  await demoSeeder.run();

  stopwatch.stopAndLogElapsedTime();
}

class DemoSeeder {
  db: Connection;
  userConsentService: UserConsentService;
  tenantUserPermissionService: TenantUserPermissionService;

  // Data seeded by the PROD script
  countries: Country[];
  permissions: Permission[];
  statuses: Status[];
  shifts: Shift[];
  rates: Rate[];
  types: Type[];
  jobRoles: JobRole[];
  employmentTypes: EmploymentType[];
  languages: Language[];
  levels: Level[];
  certifications: Certification[];
  workTypes: WorkType[];
  closeReasons: CloseReason[];

  // Data seeded by the current service
  clients: Client[];
  locations: Location[];
  workplaces: Workplace[];
  users: User[];
  tenantUsers: TenantUser[];
  tenantUserLocations: TenantUserLocation[];
  branches: Branch[];
  locationBranches: LocationBranch[];
  contracts: Contract[];
  invoices: Invoice[];
  jobOrders: JobOrder[];
  cases: Case[];
  serviceTypes: ServiceType[];

  constructor(db: Connection, services: DemoSeedServices) {
    this.db = db;
    this.userConsentService = services.userConsentService;
    this.tenantUserPermissionService = services.tenantUserPermissionService;
  }

  async run() {
    await this.fetchData();

    await this.seedClients();
    await this.seedLocations();
    await this.seedUsers();
    await this.seedBranches();
    await this.seedContracts();
    await this.seedInvoices();
    await this.seedJobOrders();
    await this.seedCases();
    await this.seedCypress();
    await this.seedCustomUsers();
  }

  /**
   * Fetch some of the entities which should be already seeded by the PROD script
   */
  async fetchData() {
    this.countries = await this.db.getCustomRepository(CountryRepository).findAll();
    this.permissions = await this.db.getCustomRepository(PermissionRepository).findAll();
    this.statuses = await this.db.getCustomRepository(StatusRepository).findAll();
    this.shifts = await this.db.getCustomRepository(ShiftRepository).findAll();
    this.rates = await this.db.getCustomRepository(RateRepository).findAll();
    this.types = await this.db.getCustomRepository(TypeRepository).findAll();
    this.jobRoles = await this.db.getCustomRepository(JobRoleRepository).findAll();
    this.employmentTypes = await this.db.getCustomRepository(EmploymentTypeRepository).findAll();
    this.languages = await this.db.getCustomRepository(LanguageRepository).findAll();
    this.levels = await this.db.getCustomRepository(LevelRepository).findAll();
    this.certifications = await this.db.getCustomRepository(CertificationRepository).findAll();
    this.workTypes = await this.db.getCustomRepository(WorkTypeRepository).findAll();
    this.closeReasons = await this.db.getCustomRepository(CloseReasonRepository).findAll();
    this.serviceTypes = await this.db.getCustomRepository(ServiceTypeRepository).findAll();
  }

  /**
   * Seed Clients, ClientProfiles and ClientConfigurations
   */
  async seedClients() {
    const createdClientsResponse: SeedClientResponse = await seedClients(this.db, this.countries);
    this.clients = createdClientsResponse.createdClients;
  }

  async seedLocations() {
    this.locations = await seedLocations(this.db, this.clients);
    this.workplaces = await seedWorkplaces(this.db, this.locations);
  }

  /**
   *  Seed Users, TenantUsers and UserProfiles
   */
  async seedUsers() {
    const seedUserResources: SeedUserResources = {
      clients: this.clients,
      locations: this.locations,
      permissions: this.permissions,
      userConsentService: this.userConsentService,
    };

    const createdUsersResponse: SeedUserResponse = await seedUsers(this.db, seedUserResources);
    const disabledUserGeneration: string[] = getDemoUsersEmails();

    this.users = createdUsersResponse.createdUsers;
    this.tenantUsers = createdUsersResponse.createdTenantUsers.filter((tenantUser) => {
      return !disabledUserGeneration.includes(tenantUser.user.email);
    });
    this.tenantUserLocations = createdUsersResponse.createdTenantUserLocations;
  }

  /**
   * Seed Branches and LocationBranches
   */
  async seedBranches() {
    const createdBranchesResponse: SeedBranchesResponse = await seedBranches(this.db, this.locations);

    this.branches = createdBranchesResponse.createdBranches;
    this.locationBranches = createdBranchesResponse.createdLocationBranches;
  }

  async seedContracts() {
    this.contracts = await seedContracts(this.db, this.locations);
  }

  async seedInvoices() {
    this.invoices = await seedInvoices(this.db, this.locations);
  }

  async seedJobOrders() {
    const seedJobOrderResources: SeedJobOrderResources = {
      statuses: this.statuses,
      locationBranches: this.locationBranches,
      clients: this.clients,
      tenantUsers: this.tenantUsers,
      locations: this.locations,
      tenantUserLocations: this.tenantUserLocations,
      shifts: this.shifts,
      rates: this.rates,
      types: this.types,
      jobRoles: this.jobRoles,
      employmentTypes: this.employmentTypes,
      languages: this.languages,
      levels: this.levels,
      certifications: this.certifications,
      workTypes: this.workTypes,
      closeReasons: this.closeReasons,
      serviceTypes: this.serviceTypes,

      tenantUserPermissionService: this.tenantUserPermissionService,
    };

    const createdJobOrdersResponse: SeedJobOrderResponse = await seedJobOrders(this.db, seedJobOrderResources);
    this.jobOrders = createdJobOrdersResponse.createdJobOrders;
  }

  async seedCases() {
    const seedCaseResources: SeedCaseResources = {
      clients: this.clients,
      locations: this.locations,
      statuses: this.statuses,
      jobOrders: this.jobOrders,
      contracts: this.contracts,
      invoices: this.invoices,
      tenantUsers: this.tenantUsers,
      tenantUserLocations: this.tenantUserLocations,
    };

    this.cases = await seedCases(this.db, seedCaseResources);
  }

  /**
   * Seed data for the Cypress User - Job Orders, Invoices
   */
  async seedCypress() {
    const seedCypressResources: SeedCypressUserResources = {
      users: this.users,
      tenantUsers: this.tenantUsers,
      tenantUserLocations: this.tenantUserLocations,
      statuses: this.statuses,
      locationBranches: this.locationBranches,
      jobOrders: this.jobOrders,
      invoices: this.invoices,
      languages: this.languages,
      levels: this.levels,
      certifications: this.certifications,
      cases: this.cases,
    };

    await seedCypressUser(this.db, seedCypressResources);
  }

  /**
   * Seed some Custom Users and associate data with them - Job Orders
   */
  async seedCustomUsers() {
    const tenantUsers: TenantUser[] = await this.db.getCustomRepository(TenantUserRepository).findAll();
    const customUsersResources: SeedCustomUserResources = {
      tenantUsers,
      statuses: this.statuses,
      locationBranches: this.locationBranches,
      locations: this.locations,
      tenantUserLocations: this.tenantUserLocations,
      shifts: this.shifts,
      rates: this.rates,
      types: this.types,
      jobRoles: this.jobRoles,
      employmentTypes: this.employmentTypes,
      workTypes: this.workTypes,
      experienceLevels: filterLevelByEntity(this.levels, LevelEntityEnum.Experience),
      serviceTypes: this.serviceTypes,
      timeSheetApproverContacts: null,
      billToContacts: null,
      reportToContacts: null,

      users: this.users,
      jobOrders: this.jobOrders,
      closeReasons: this.closeReasons,
      tenantUserPermissionService: this.tenantUserPermissionService,
    };

    await seedCustomUsers(this.db, customUsersResources);
  }
}
