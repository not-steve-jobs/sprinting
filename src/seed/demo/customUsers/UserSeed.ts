import {Connection} from 'typeorm';
import {User} from 'src/modules/user/user.entity';
import {SeedJobOrderDto} from 'src/modules/jobOrder/dto/seedJobOrder.dto';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {seedJobOrder, generateJobOrderData} from '../jobOrders/jobOrder/seed';
import {DemoUserData, JobOrderProperties, SeedCustomUserResources, UserDataConfig} from './utils';
import {
  filterContractTypesByTenant,
  filterEmploymentTypesByTenant,
  filterJobOrderStatuses,
  filterJobRolesByTenant,
  filterRatesByTenant,
  filterServiceTypesByTenant,
  filterShiftsByTenant,
  filterTenantUsersByTenantAndClient,
  filterWorkTypesByTenant,
} from '../jobOrders/jobOrder/utils';
import {JobContactDto} from 'src/modules/tenantUserPermission/dto/jobContact.dto';
import {
  filterBillToJobContacts,
  filterReportToJobContacts,
  filterTimeSheetApproverJobContacts,
} from '../users/user/utils';
import {log} from 'src/seed/utils/seed.utils';
import {JobOrderRepository} from 'src/modules/jobOrder/jobOrder.repository';
import {seedJobOrderWithSpecificAssociates} from '../jobOrders/jobOrderAssociate/seed';
import {JobOrderAssociate} from 'src/modules/jobOrderAssociate/jobOrderAssociate.entity';
import {filterJobOrderAssociateStatuses} from '../jobOrders/jobOrderAssociate/utils';
import {seedCancelledJobOrdersDetails} from '../jobOrders/closeReasonArguments/seed';
import {CloseReasonArguments} from 'src/modules/closeReasonArguments/closeReasonArguments.entity';

export default class UserSeed {
  constructor(properties: any = {}) {
    Object.assign(this, properties);
  }

  private databaseRef: Connection = null;
  private resources: SeedCustomUserResources = null;
  private rawData: DemoUserData = null;

  /**
   * Generates demo user account, by calling all generation functions in order.
   */
  public async generateUserData() {
    const userProperties: User = this.resources.users.find((user) => user.email === this.rawData.user.email);
    if (userProperties?.id) {
      const createdJobsForDemoUser: JobOrder[] = await this.databaseRef
        .getCustomRepository(JobOrderRepository)
        .getJobOrdersByUserId(userProperties.id);
      if (createdJobsForDemoUser.length === 0) {
        const contacts: JobContactDto[][] = await this.getJobContacts();
        const jobResults: JobOrder[][] = await this.generateJobOrders(contacts, userProperties.clientId);
        if (jobResults && jobResults.length > 0) {
          await this.generateJobOrdersAssociates(jobResults);
          await this.generateCloseReasonArguments(jobResults);
        } else {
          console.error(`ERROR: Couldn't create job orders for ${this.rawData.user.firstName}!`);
        }
      } else {
        log(`${this.rawData.user.firstName}'s job orders are already generated, skipping generation`, 3);
      }
    } else {
      console.error(`ERROR: User with e-mail '${this.rawData.user.email}' was not found!`);
    }
  }

  /**
   * Generates Job Orders for a demo account.
   *
   * @param {JobContactDto[][]} contacts - Job order contacts
   * @param {string} clientId - Client ID of user
   * @returns {Promise<JobOrder[][]>} - Promise of new records
   */
  private generateJobOrders = (contacts: JobContactDto[][], clientId: string): Promise<JobOrder[][]> => {
    const allJobQueries: Promise<JobOrder[]>[] = [];
    let tenantJobQueries: Promise<JobOrder>[] = [];
    let tenantId: number = 0;
    let generatedJobOrder: SeedJobOrderDto = null;
    contacts.forEach((tenantJobContacts: JobContactDto[], index: number) => {
      tenantId = this.rawData.jobOrders[index].tenantId;
      log(`Seeding Job Orders for ${this.rawData.user.firstName} (tenant ${tenantId})`, 3);
      tenantJobQueries = [];
      this.rawData.jobOrders[index].jobOrderProps.forEach((jobProperties: JobOrderProperties) => {
        generatedJobOrder = generateJobOrderData(
          tenantId,
          clientId,
          this.getResourcesForTenant(tenantId, clientId, tenantJobContacts),
        );
        generatedJobOrder.name = jobProperties.name;
        generatedJobOrder.statusId = this.resources.statuses.filter(
          (status) => status.tenantId === tenantId && status.name === jobProperties.orderStatus,
        )[0].id;
        generatedJobOrder.userId = this.rawData.user.id;
        generatedJobOrder.numberOfOpenings = jobProperties.numberOfOpenings;
        tenantJobQueries.push(seedJobOrder(this.databaseRef, generatedJobOrder));
      });
      allJobQueries.push(Promise.all(tenantJobQueries));
    });
    return Promise.all(allJobQueries);
  };

  /**
   * Generates Job Orders Associates for a demo account.
   *
   * @param {JobOrder[][]} jobOrders - Job orders for assigning associates to
   * @returns {Promise<JobOrderAssociate[][]>} - Promise of new records
   */
  private generateJobOrdersAssociates = (jobOrders: JobOrder[][]): Promise<JobOrderAssociate[][]> => {
    const associateResults: Promise<JobOrderAssociate[]>[] = [];
    let tenantId: number = 0;
    jobOrders.forEach((jobs: JobOrder[], tenantIndex: number) => {
      tenantId = this.rawData.jobOrders[tenantIndex].tenantId;
      log(`Seeding Job Orders Associates for ${this.rawData.user.firstName} (tenant ${tenantId})`, 3);
      jobs.forEach((job: JobOrder, jobIndex: number) => {
        associateResults.push(
          seedJobOrderWithSpecificAssociates(
            this.databaseRef,
            job,
            this.rawData.jobOrders[tenantIndex].jobOrderProps[jobIndex].candidates,
            filterJobOrderAssociateStatuses(this.resources.statuses, tenantId),
          ),
        );
      });
    });
    return Promise.all(associateResults);
  };

  /**
   * Generates Close Reason Arguments for a demo account.
   *
   * @param {JobOrder[][]} jobOrders - Job orders for assigning associates to
   * @returns {Promise<CloseReasonArguments[][]>} - Promise of new records
   */
  private generateCloseReasonArguments = (jobOrders: JobOrder[][]): Promise<CloseReasonArguments[][]> => {
    const closeReasonResults: Promise<CloseReasonArguments[]>[] = [];
    jobOrders.forEach((jobs: JobOrder[], tenantIndex: number) => {
      log(
        `Seeding Close Reason Arguments for ${this.rawData.user.firstName} (tenant ${this.rawData.jobOrders[tenantIndex].tenantId})`,
        3,
      );
      closeReasonResults.push(
        seedCancelledJobOrdersDetails(this.databaseRef, jobs, this.resources.statuses, this.resources.closeReasons),
      );
    });
    return Promise.all(closeReasonResults);
  };

  /**
   * Generates Job Orders Contacts for a demo account.
   *
   * @returns {Promise<JobContactDto[][]>} - Promise of new records
   */
  private getJobContacts(): Promise<JobContactDto[][]> {
    const contactsQueries: Promise<JobContactDto[]>[] = [];
    this.rawData.jobOrders.forEach((tenantData: UserDataConfig) => {
      if (tenantData.jobOrderProps.length > 0) {
        contactsQueries.push(this.resources.tenantUserPermissionService.getAvailableJobContacts(tenantData.tenantId));
      }
    });
    return Promise.all(contactsQueries);
  }

  /**
   * Returns resources for generating Job Orders.
   *
   * @param {number} tenantId - Current tenant ID
   * @param {string} clientId - Current client ID
   * @param {JobContactDto[]} tenantJobContacts - Generated Job Orders contacts
   * @returns {SeedCustomUserResources} - Resources object
   */
  private getResourcesForTenant(
    tenantId: number,
    clientId: string,
    tenantJobContacts: JobContactDto[],
  ): SeedCustomUserResources {
    return {
      ...this.resources,
      tenantUsers: filterTenantUsersByTenantAndClient(this.resources.tenantUsers, tenantId, clientId),
      serviceTypes: filterServiceTypesByTenant(this.resources.serviceTypes, tenantId),
      rates: filterRatesByTenant(this.resources.rates, tenantId),
      shifts: filterShiftsByTenant(this.resources.shifts, tenantId),
      types: filterContractTypesByTenant(this.resources.types, tenantId),
      jobRoles: filterJobRolesByTenant(this.resources.jobRoles, tenantId),
      statuses: filterJobOrderStatuses(this.resources.statuses, tenantId),
      employmentTypes: filterEmploymentTypesByTenant(this.resources.employmentTypes, tenantId),
      workTypes: filterWorkTypesByTenant(this.resources.workTypes, tenantId),
      timeSheetApproverContacts: filterTimeSheetApproverJobContacts(tenantJobContacts),
      billToContacts: filterBillToJobContacts(tenantJobContacts),
      reportToContacts: filterReportToJobContacts(tenantJobContacts),
    };
  }
}
