import * as dateFns from 'date-fns';
import {StatusDto} from './../status/dto/status.dto';
import {CloseReasonEnum} from 'src/modules/closeReason/closeReason.enum';
import {JobOrderAssociate} from 'src/modules/jobOrderAssociate/jobOrderAssociate.entity';
import {AuthRoles} from '../../core/auth/authRoles';
import {PlainObject} from '../common/common.dto';
import {AbstractRepository, Brackets, EntityRepository, In, SelectQueryBuilder} from 'typeorm';
import {JobOrder} from './jobOrder.entity';
import {FilteringOptions, Pagination, PaginationOptions, SortingOptions} from '../common/paginate';
import {UtilsHelper} from '../../helpers/utils.helper';
import {Location} from '../location/location.entity';
import {JobOrderAssociateStatus, JobOrderStatus} from '../status/status.enum';
import {getFeatureConfigurationFeatureName} from './dto/jobOrder.dto';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {SimpleJobOrderDto} from './dto/simpleJobOrder.dto';

export const getNoOfPlacedAssociates = (
  jobOrderAssociates: JobOrderAssociate[],
  orderDetailsListingStatuses: PlainObject | null,
) => {
  return (jobOrderAssociates ?? []).filter(({status, rejected}) => {
    const name = status?.name;
    if (!name || !orderDetailsListingStatuses?.config?.placedCandidates || rejected) return false;
    return (orderDetailsListingStatuses?.config?.placedCandidates ?? []).includes(name as JobOrderAssociateStatus);
  }).length;
};
@EntityRepository(JobOrder)
export class JobOrderRepository extends AbstractRepository<JobOrder> {
  private q(tenantId: number, jobOrderId?: string): SelectQueryBuilder<JobOrder> {
    const queryBuilder = this.createQueryBuilder('JobOrder').where('"JobOrder"."tenantId" = :tenantId', {tenantId});
    if (jobOrderId) {
      queryBuilder.andWhere('"JobOrder"."id" = :jobOrderId', {jobOrderId});
    }
    return queryBuilder;
  }

  // List with all referenced entities which should be obtained when performing queries for getting a specific Job Order
  private findOneRelations: string[] = [
    'jobOrderLanguage',
    'jobOrderLanguage.language',
    'jobOrderLanguage.level',
    'jobOrderCertification',
    'jobOrderCertification.certification',
    'closeReasonArguments',
    'closeReasonArguments.closeReason',
    // 'closeReasonArguments.closeReason.tenant', //TODO: add tenant relation (#2355)
  ];

  public async findOne(
    tenantId: number,
    id: string,
    includeStatusDetails?: boolean,
    includeUser?: boolean,
    includeIsDisplayedFlag = true,
    additionalRelations: string[] = [],
  ): Promise<JobOrder> {
    const relations: string[] = [...this.findOneRelations, ...additionalRelations];

    if (includeStatusDetails) {
      relations.push('status');
    }

    if (includeUser) {
      relations.push('tenantUser');
      relations.push('tenantUser.user');
      relations.push('tenantUser.user.userProfile');
    }

    return this.manager.findOne(JobOrder, {
      where: {tenantId, id, ...(includeIsDisplayedFlag ? {isDisplayed: true} : {})},
      relations,
    });
  }

  public async findOneById(id: string, additionalRelations: string[] = []): Promise<JobOrder> {
    const relations: string[] = [...this.findOneRelations, ...additionalRelations];

    return this.manager.findOne(JobOrder, {
      where: {id},
      relations,
    });
  }

  public async save(entity: JobOrder): Promise<JobOrder> {
    return this.manager.save(entity);
  }

  public async delete(entity: JobOrder) {
    return this.manager.remove(entity);
  }

  private getBaseJobOrderWithStatusQuery(
    tenantId: number,
    clientId: string,
    tenantUser: TenantUser,
  ): SelectQueryBuilder<JobOrder> {
    const {userId, roleId, tenantUserLocations} = tenantUser;
    const tenantUserLocationIds = tenantUserLocations.map((ul) => ul.locationId);

    const query = this.q(tenantId).leftJoin('JobOrder.status', 'Status');

    query.andWhere('"JobOrder"."clientId" = :clientId', {clientId});
    query.andWhere('"JobOrder"."isDisplayed" = TRUE');

    if (!AuthRoles.isAdmin(roleId)) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('"JobOrder"."locationId" = ANY (:tenantUserLocationIds)', {tenantUserLocationIds});
          qb.orWhere(
            'JobOrder.locationId is null',
          ).andWhere('JobOrder.tenantId = :tenantId AND JobOrder.userId = :userId', {tenantId, userId});
        }),
      );
    }
    return query;
  }

  /**
   * Counts Job Orders matching a set of filters
   * @param tenantId Id of the tenant
   * @param clientId Id of the client
   * @param filteringOptions Filters
   * @param tenantUser Current TenantUser (required to filter some permissions)
   * @returns Number of job orders matched
   */
  public async countJobOrders(
    tenantId: number,
    clientId: string,
    filteringOptions: FilteringOptions,
    tenantUser: TenantUser,
  ): Promise<number> {
    let query = this.getBaseJobOrderWithStatusQuery(tenantId, clientId, tenantUser);

    const {findBetween, findIn} = filteringOptions.filter || {};
    query = UtilsHelper.applyFilter(findIn, findBetween, query, 'jobOrder');

    return query.getCount();
  }

  /**
   * Obtains Job Orders with a limited parameter set, filtered by their start date
   * @param tenantId Id of the tenant
   * @param clientId Id of the client
   * @param from Earliest start date to filter by
   * @param to Latest start date to filter by
   * @param tenantUser Current TenantUser (required to filter some permissions)
   * @returns Job Orders with id, dates and status
   */
  public async getSimpleJobOrdersStartingInPeriod(
    tenantId: number,
    clientId: string,
    from: Date,
    to: Date,
    tenantUser: TenantUser,
  ): Promise<SimpleJobOrderDto[]> {
    let query = this.getBaseJobOrderWithStatusQuery(tenantId, clientId, tenantUser);

    query.andWhere(`"JobOrder"."dateStart" BETWEEN :from AND :to`, {from, to});

    query = query.select([
      'JobOrder.id',
      'JobOrder.name',
      'JobOrder.dateStart',
      'JobOrder.dateEnd',
      'JobOrder.submissionDate',
      'JobOrder.numberOfOpenings',
      'JobOrder.status',
      'Status.name',
    ]);

    const result = await query.getMany();
    const mappedResult = result.map((jobOrder: JobOrder) => {
      return {
        number: jobOrder.id,
        startDate: jobOrder.dateStart,
        endDate: jobOrder.dateEnd,
        status: jobOrder.status.name as JobOrderStatus,
        statusId: jobOrder.status.id,
      };
    });
    return mappedResult;
  }

  public async fetchAllJobOrders(
    tenantId: number,
    clientId: string,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    tenantUser: TenantUser,
    usePagination = true,
    orderDetailsListingStatuses?: PlainObject | null,
  ) {
    /***
     * Because we have multiple joins and webKeys in feature configurations doesn't match
     * columns naming in database, we must map table by webKey and column also by webKey
     * P. S. orderDESCorASC is 'ASC' when sortingOptions.sort.key has value 'firstName'
     * because that is the default ordering (when the page loads for the first time)
     */
    const orderByTableAndColumn =
      UtilsHelper.getTableFromSortKey(sortingOptions.sort.key) +
      UtilsHelper.getColumnNameFromSortKey(sortingOptions.sort.key);
    const orderDESCorASC = UtilsHelper.getOrderDirection(sortingOptions);

    const {findBetween, findIn} = filteringOptions.filter || {};

    let query = this.getBaseJobOrderWithStatusQuery(tenantId, clientId, tenantUser);

    query = query.select([
      'JobOrder.id',
      'JobOrder.tenantId',
      'JobOrder.userId',
      'JobOrder.name',
      'JobOrder.createdAt',
      'JobOrder.updatedAt',
      'JobOrder.dateStart',
      'JobOrder.dateEnd',
      'JobOrder.submissionDate',
      'JobOrder.numberOfOpenings',
      'JobOrder.tenantUser',
      'JobOrder.status',
      'JobOrder.location',
      'JobOrder.jobRole',
      'JobOrder.shift',
      'JobOrder.workTypeId',
      'Status',
      'Role.name',
      'Role.keyName',
      'Location.id',
      'Location.locationName',
      'TenantUser.tenantId',
      'UserStatus.name',
      'TenantUser.user',
      'ServiceType',
      'JobOrderAssociate',
      'JobOrderAssociateStatus',
      'Shift.name',
      'Shift.keyName',
    ]);

    query = UtilsHelper.applyFilter(findIn, findBetween, query, 'jobOrder');

    query = query
      .leftJoin('JobOrder.jobRole', 'Role')
      .leftJoin('JobOrder.location', 'Location')
      .leftJoin('JobOrder.tenantUser', 'TenantUser')
      .leftJoin('JobOrder.serviceType', 'ServiceType')
      .leftJoin('JobOrder.shift', 'Shift')
      .leftJoin('JobOrder.jobOrderAssociate', 'JobOrderAssociate', 'JobOrder.id = JobOrderAssociate.jobOrderId')
      .leftJoin('JobOrderAssociate.status', 'JobOrderAssociateStatus')
      .leftJoinAndSelect('TenantUser.user', 'User')
      .leftJoinAndSelect('TenantUser.status', 'UserStatus')
      .leftJoinAndSelect('User.userProfile', 'UserProfile');

    if (usePagination) {
      query = query
        .take(paginatorOptions.itemsPerPage)
        .skip((paginatorOptions.page - 1) * paginatorOptions.itemsPerPage);
    }
    query = query.orderBy(orderByTableAndColumn, orderDESCorASC);
    const [results, total] = await query.getManyAndCount();
    const dateFormat = 'dd/MM/yy';

    const newResult = results.map((jobOrder: JobOrder) => {
      const serviceTypeName = jobOrder.serviceType?.name;
      const formattedStartDate = jobOrder.dateStart ? dateFns.format(jobOrder.dateStart, dateFormat) : '-';
      const formattedEndDate = jobOrder.dateEnd ? dateFns.format(jobOrder.dateEnd, dateFormat) : '-';

      return {
        number: jobOrder.id,
        name: jobOrder.name,
        serviceType: serviceTypeName,
        serviceTypeId: jobOrder.serviceType?.id ?? '',
        featureConfigurationFeatureName: getFeatureConfigurationFeatureName(serviceTypeName),
        submissionDate: jobOrder.submissionDate,
        createdBy: `${jobOrder.tenantUser.user.userProfile.firstName} ${jobOrder.tenantUser.user.userProfile.lastName}`,
        userStatus: jobOrder.tenantUser.status.name,
        startDate: jobOrder.dateStart,
        startAndEndDate: `${formattedStartDate} - ${formattedEndDate}`,
        endDate: jobOrder.dateEnd,
        noOfPositions: jobOrder.numberOfOpenings,
        noOfAssociates: jobOrder.jobOrderAssociate.length,
        status: jobOrder.status.name,
        noOfPlacedAssociates: getNoOfPlacedAssociates(jobOrder.jobOrderAssociate, orderDetailsListingStatuses),
        statusId: jobOrder.status.id,
        location: jobOrder.location?.locationName ?? '',
        locationId: jobOrder.location?.id ?? '',
        role: jobOrder.jobRole?.name ?? '',
        roleKeyName: jobOrder.jobRole?.keyName ?? '',
        tenantId: jobOrder.tenantId,
        shift: jobOrder.shift?.name ?? '',
        shiftKeyName: jobOrder.shift?.keyName ?? '',
        userId: jobOrder.userId ?? null,
      };
    });

    return new Pagination<any>({
      results: newResult,
      total,
    });
  }

  private getStatus(statusName: JobOrderStatus, jobOrderStatuses: StatusDto[]): StatusDto | null | undefined {
    return (jobOrderStatuses ?? []).find((x) => x.name === statusName);
  }

  private async saveRecalculatedJobOrder(
    tenantId: number,
    jobOrderId: string,
    status: StatusDto,
  ): Promise<StatusDto | undefined> {
    if (status && status.id) {
      await this.q(tenantId, jobOrderId)
        .update({
          statusId: status.id,
        })
        .execute();

      return status;
    }
  }

  // this will change JobOrder status to correct one. This is related to a changes of associates related to specific order
  public async recalculateJobOrderStatus(
    tenantId: number,
    jobOrderId: string,
    jobOrderStatuses: StatusDto[],
    isInternalAction?: boolean,
  ): Promise<StatusDto | undefined> {
    let query: any = this.q(tenantId, jobOrderId);

    query = query.select([
      'JobOrder.id',
      'JobOrder.tenantId',
      'JobOrder.numberOfOpenings',
      'JobOrder.status',
      'Status',
      'JobOrderAssociate',
      'CloseReasonArguments',
    ]);

    query = query
      .leftJoin('JobOrder.status', 'Status')
      .leftJoin('JobOrder.jobOrderAssociate', 'JobOrderAssociate', 'JobOrder.id = JobOrderAssociate.jobOrderId')
      .leftJoin(
        'JobOrder.closeReasonArguments',
        'CloseReasonArguments',
        'JobOrder.id = CloseReasonArguments.jobOrderId',
      )
      .leftJoinAndSelect('CloseReasonArguments.closeReason', 'CloseReason')
      .leftJoinAndSelect('JobOrderAssociate.status', 'AssociateStatus');
    const jobOrder = await query.getOne();

    if (!jobOrder) return;
    const {jobOrderAssociate, numberOfOpenings, closeReasonArguments} = jobOrder;
    let status: StatusDto = jobOrder?.status;

    // change order status if closeReasonArguments was filled
    if (closeReasonArguments?.closeReason) {
      switch (closeReasonArguments?.closeReason?.reason) {
        case CloseReasonEnum.Filled:
          status = this.getStatus(JobOrderStatus.Covered, jobOrderStatuses);
          break;
        case CloseReasonEnum.CompetitorFilled:
          status = this.getStatus(JobOrderStatus.NotFilledByAdecco, jobOrderStatuses);
          break;
        case CloseReasonEnum.PartiallyFulfilled:
          status = this.getStatus(JobOrderStatus.PartiallyCovered, jobOrderStatuses);
          break;
        case CloseReasonEnum.CancelledByJobOwner:
        case CloseReasonEnum.CancelledByClient:
        case CloseReasonEnum.ClientFilled:
        case CloseReasonEnum.HiredByJobOwner:
        case CloseReasonEnum.UnavailableEmployee:
        case CloseReasonEnum.ChangedPlans:
        case CloseReasonEnum.OtherService:
          status = this.getStatus(JobOrderStatus.CanceledByTheClient, jobOrderStatuses);
          break;
        case CloseReasonEnum.Other:
        case CloseReasonEnum.BillRateNotAccept:
          if (isInternalAction) {
            status = this.getStatus(JobOrderStatus.CanceledByTheClient, jobOrderStatuses);
          } else {
            status = this.getStatus(JobOrderStatus.CancelledByAdecco, jobOrderStatuses);
          }
          break;
        default:
          //NotApproved, CreditProblems, JobOwnerAbuse, JobOwnerNoStandards, Discrimination, ExcludedJobList, PersonalSafety
          status = this.getStatus(JobOrderStatus.CancelledByAdecco, jobOrderStatuses);
          break;
      }
      return await this.saveRecalculatedJobOrder(tenantId, jobOrderId, status);
    }

    const nonRejectedJobOrderAssociates = (jobOrderAssociate || []).filter((associate) => !associate.rejected);

    // Check if job order should be in 'Submitted' stage.
    if (!nonRejectedJobOrderAssociates.length) {
      status = this.getStatus(JobOrderStatus.Submitted, jobOrderStatuses);
    }

    // Check if job order should be in 'In Progress' stage
    if (nonRejectedJobOrderAssociates.length > 0) {
      status = this.getStatus(JobOrderStatus.InProgress, jobOrderStatuses);
    }

    const candidatesForSelection = nonRejectedJobOrderAssociates.filter((associate) =>
      [
        JobOrderAssociateStatus.Submittal,
        JobOrderAssociateStatus.SendOut,
        JobOrderAssociateStatus.References,
        JobOrderAssociateStatus.Offer,
        JobOrderAssociateStatus.AdminCheck,
      ].includes(associate.status.name),
    );

    // Check if job order should be in 'Selection' stage
    if (candidatesForSelection && candidatesForSelection.length > 0) {
      status = this.getStatus(JobOrderStatus.CandidatesPreselection, jobOrderStatuses);
    }

    const preContractCandidates = nonRejectedJobOrderAssociates.filter(
      (associate) => associate.status.name === JobOrderAssociateStatus.PreContract,
    );

    // Check if job order should be in 'Partial' stage
    if (preContractCandidates.length && 0 < preContractCandidates.length < numberOfOpenings) {
      status = this.getStatus(JobOrderStatus.PartiallyCovered, jobOrderStatuses);
    }

    // Check if job order should be in 'Covered' stage
    if (preContractCandidates.length && preContractCandidates.length >= numberOfOpenings) {
      status = this.getStatus(JobOrderStatus.Covered, jobOrderStatuses);
    }

    return await this.saveRecalculatedJobOrder(tenantId, jobOrderId, status);
  }

  public async groupStuffingRequestsByStatus(
    tenantId: number,
    clientId: string,
    filteringOptions: FilteringOptions,
  ): Promise<any> {
    const {findBetween, findIn} = filteringOptions.filter ?? {};

    let query: any = this.q(tenantId)
      .select(['Status.name AS status'])
      .addSelect('COUNT(DISTINCT JobOrder.id) AS count')
      .addSelect('JobOrder.dateStart AS startDate')
      .addSelect('JobOrder.dateEnd AS endDate')
      .andWhere('"JobOrder"."clientId" = :clientId', {clientId});

    query = UtilsHelper.applyFilter(findIn, findBetween, query);

    query = query
      .leftJoin('JobOrder.status', 'Status')
      .groupBy('Status.name')
      .addGroupBy('JobOrder.dateStart')
      .addGroupBy('JobOrder.dateEnd')
      .getRawMany();

    const results = await query;
    return results;
  }

  public async fetchAllPartialJobOrders(
    tenantId: number,
    clientId: string,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    tenantUser: PlainObject,
    usePagination = true,
    orderDetailsListingStatuses?: PlainObject | null,
  ) {
    /***
     * Because we have multiple joins and webKeys in feature configurations doesn't match
     * columns naming in database, we must map table by webKey and column also by webKey
     * P. S. orderDESCorASC is 'ASC' when sortingOptions.sort.key has value 'firstName'
     * because that is the default ordering (when the page loads for the first time)
     */
    const orderByTableAndColumn =
      UtilsHelper.getTableFromSortKey(sortingOptions.sort.key) +
      UtilsHelper.getColumnNameFromSortKey(sortingOptions.sort.key);
    const orderDESCorASC = UtilsHelper.getOrderDirection(sortingOptions);
    const {userId, roleId, tenantUserLocations} = tenantUser;
    const tenantUserLocationIds = tenantUserLocations.map((ul: Location) => ul.id);

    const {findBetween, findIn} = filteringOptions.filter || {};

    let query: any = this.q(tenantId);

    query.andWhere('"JobOrder"."clientId" = :clientId', {clientId});
    query.andWhere('"JobOrder"."isDisplayed" = :isDisplayed', {isDisplayed: true});

    if (!AuthRoles.isAdmin(roleId)) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('"JobOrder"."locationId" = ANY (:tenantUserLocationIds)', {tenantUserLocationIds});
          qb.orWhere(
            'JobOrder.locationId is null',
          ).andWhere('JobOrder.tenantId = :tenantId AND JobOrder.userId = :userId', {tenantId, userId});
        }),
      );
    }

    query = query.select([
      'JobOrder.id',
      'JobOrder.tenantId',
      'JobOrder.name',
      'JobOrder.createdAt',
      'JobOrder.updatedAt',
      'JobOrder.dateStart',
      'JobOrder.dateEnd',
      'JobOrder.submissionDate',
      'JobOrder.numberOfOpenings',
      'JobOrder.tenantUser',
      'JobOrder.status',
      'JobOrder.location',
      'JobOrder.jobRole',
      'JobOrder.shift',
      'Status',
      'Role.name',
      'Location.id',
      'Location.locationName',
      'TenantUser.tenantId',
      'UserStatus.name',
      'TenantUser.user',
      'ServiceType',
      'JobOrderAssociate',
      'JobOrderAssociateStatus',
      'Shift.name',
    ]);

    query = UtilsHelper.applyFilter(findIn, findBetween, query, 'jobOrder');

    query = query
      .leftJoin('JobOrder.status', 'Status')
      .leftJoin('JobOrder.jobRole', 'Role')
      .leftJoin('JobOrder.location', 'Location')
      .leftJoin('JobOrder.tenantUser', 'TenantUser')
      .leftJoin('JobOrder.serviceType', 'ServiceType')
      .leftJoin('JobOrder.shift', 'Shift')
      .leftJoin('JobOrder.jobOrderAssociate', 'JobOrderAssociate', 'JobOrder.id = JobOrderAssociate.jobOrderId')
      .leftJoin('JobOrderAssociate.status', 'JobOrderAssociateStatus')
      .leftJoinAndSelect('TenantUser.user', 'User')
      .leftJoinAndSelect('TenantUser.status', 'UserStatus')
      .leftJoinAndSelect('User.userProfile', 'UserProfile');

    if (usePagination) {
      query = query
        .take(paginatorOptions.itemsPerPage)
        .skip((paginatorOptions.page - 1) * paginatorOptions.itemsPerPage);
    }
    query = query.orderBy(orderByTableAndColumn, orderDESCorASC).getManyAndCount();
    const [results, total] = await query;
    const dateFormat = 'dd/MM/yy';

    const newResult = results.map((jobOrder: JobOrder) => {
      const serviceTypeName = jobOrder.serviceType?.name;
      const formattedStartDate = jobOrder.dateStart ? dateFns.format(jobOrder.dateStart, dateFormat) : '-';
      const formattedEndDate = jobOrder.dateEnd ? dateFns.format(jobOrder.dateEnd, dateFormat) : '-';

      return {
        number: jobOrder.id,
        name: jobOrder.name,
        serviceType: serviceTypeName,
        serviceTypeId: jobOrder.serviceType?.id ?? '',
        featureConfigurationFeatureName: getFeatureConfigurationFeatureName(serviceTypeName),
        submissionDate: jobOrder.submissionDate,
        createdBy: `${jobOrder.tenantUser.user.userProfile.firstName} ${jobOrder.tenantUser.user.userProfile.lastName}`,
        userStatus: jobOrder.tenantUser.status.name,
        startDate: jobOrder.dateStart,
        startAndEndDate: `${formattedStartDate} - ${formattedEndDate}`,
        endDate: jobOrder.dateEnd,
        noOfPositions: jobOrder.numberOfOpenings,
        noOfAssociates: jobOrder.jobOrderAssociate.length,
        status: jobOrder.status.name,
        noOfPlacedAssociates: getNoOfPlacedAssociates(jobOrder.jobOrderAssociate, orderDetailsListingStatuses),
        statusId: jobOrder.status.id,
        location: jobOrder.location?.locationName ?? '',
        locationId: jobOrder.location?.id ?? '',
        role: jobOrder.jobRole?.name ?? '',
        tenantId: jobOrder.tenantId,
        shift: jobOrder.shift?.name ?? '',
      };
    });

    return new Pagination<any>({
      results: newResult,
      total,
    });
  }

  public async findJobOrdersByRolesAndTenant(tenantId: number, jobRoleIds: string[]) {
    return this.q(tenantId).andWhere('"jobRoleId" IN (:...jobRoleIds)', {jobRoleIds}).select('JobOrder.id').getMany();
  }

  public async deleteJobOrders(tenantId: number, jobOrderIds: string[]) {
    return jobOrderIds.length
      ? this.q(tenantId).andWhere('"id" IN (:...jobOrderIds)', {jobOrderIds}).delete().execute()
      : '';
  }

  public async getJobOrdersByUserId(userId: string) {
    return this.createQueryBuilder('JobOrder').where('JobOrder.userId = :userId', {userId}).select().getMany();
  }

  /**
   * Filter out the JobOrders without JobOrderAssociates
   * Because of the nature of the filter function we can't use it directly with async and we do such mapping
   *
   * @param {JobOrder[]} jobOrders - The list with JobOrders we want to filter out
   * @returns {Promise<JobOrder[]>}
   */
  public async getJobOrdersWithoutAssociates(jobOrders: JobOrder[]): Promise<JobOrder[]> {
    const jobOrdersWithoutAssociates: JobOrder[] = await Promise.all(
      jobOrders.map(async (jobOrder: JobOrder) => {
        const jobOrderDetails: JobOrder = await this.findOne(jobOrder.tenantId, jobOrder.id, false, false, false, [
          'jobOrderAssociate',
        ]);
        if (jobOrderDetails.jobOrderAssociate.length === 0) {
          return jobOrderDetails;
        }

        return null;
      }),
    );

    return jobOrdersWithoutAssociates.filter((jobOrder) => jobOrder);
  }

  public async findManyByIds(tenantId: number, ids: string[], relations: string[] = []): Promise<JobOrder[]> {
    return this.manager.find(JobOrder, {
      where: {
        tenantId,
        id: In(ids),
      },
      relations,
    });
  }
}
