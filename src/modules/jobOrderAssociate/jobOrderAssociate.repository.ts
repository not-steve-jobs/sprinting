import {FilteringOptions} from './../common/paginate/filtering/filteringOptions.interface';
import {SortingOptions} from './../common/paginate/sortingOptions.interface';
import {PaginationOptions} from './../common/paginate/paginationOptions.interface';
import {Pagination} from './../common/paginate/pagination';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {JobOrderAssociatesDto} from './dto/jobOrderAssociates.dto';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {JobOrderAssociate} from './jobOrderAssociate.entity';

@EntityRepository(JobOrderAssociate)
export class JobOrderAssociateRepository extends AbstractRepository<JobOrderAssociate> {
  private q(tenantId: number): SelectQueryBuilder<JobOrderAssociate> {
    return this.createQueryBuilder('JobOrderAssociate').where('"JobOrderAssociate"."tenantId" = :tenantId', {tenantId});
  }

  public async findOne(
    jobOrderId: string,
    tenantId: number,
    userId: string,
    includeStatusDetails?: boolean,
    includeUser?: boolean,
    additionalRelations: string[] = [],
  ): Promise<JobOrderAssociate> {
    const relations = [...additionalRelations];

    if (includeStatusDetails) {
      relations.push('status');
    }

    if (includeUser) {
      relations.push('tenantUser');
      relations.push('tenantUser.user');
      relations.push('tenantUser.user.userProfile');
    }

    return this.manager.findOne(JobOrderAssociate, {
      where: {
        jobOrderId,
        tenantId,
        userId,
      },
      relations,
    });
  }

  public async save(entity: JobOrderAssociate) {
    return this.manager.save(entity);
  }

  public async fetchAssociates(tenantId: number, jobOrderId: string): Promise<JobOrderAssociatesDto[]> {
    const query = await this.q(tenantId)
      .select([
        'JobOrderAssociate.tenantId',
        'JobOrderAssociate.jobOrderId',
        'Status.name',
        'Status.id',
        'JobOrderAssociate.userId',
      ])
      .andWhere('"JobOrderAssociate"."jobOrderId" = :jobOrderId', {jobOrderId})
      .leftJoin('JobOrderAssociate.status', 'Status')
      .getMany();

    return query.map(({userId, status}) => ({
      associateId: userId,
      name: null,
      status: status.name,
      statusId: status.id,
    }));
  }

  public async fetchActiveAssociates(tenantId: number, jobOrderId: string): Promise<JobOrderAssociatesDto[]> {
    const selectArray = [
      'JobOrderAssociate.userId',
      'JobOrderAssociate.tenantId',
      'JobOrderAssociate.jobOrderId',
      'JobOrderAssociate.createdAt',
      'JobOrderAssociate.interviewDate',
      'JobOrderAssociate.movedBackFromSelect',
      'Status.name',
      'Status.id',
    ];
    const jobOrderAssociates: JobOrderAssociate[] = await this.q(tenantId)
      .select(selectArray)
      .andWhere('JobOrderAssociate.jobOrderId = :jobOrderId', {jobOrderId})
      .andWhere('JobOrderAssociate.rejected = false')
      .leftJoin('JobOrderAssociate.status', 'Status')
      .getMany();

    return jobOrderAssociates.map(
      ({userId, createdAt, status, interviewDate, movedBackFromSelect, jobOrderAssociateCases}) => {
        return {
          associateId: userId,
          name: null,
          status: status.name,
          statusId: status.id,
          createdAt,
          interviewDate,
          movedBackFromSelect,
          jobOrderAssociateCases,
        };
      },
    );
  }

  public async fetchPaginatedAssociates(
    tenantId: number,
    jobOrderId: string,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    loadedCandidateIds: string[],
  ) {
    const {findBetween, findIn, notIn} = filteringOptions.filter || {};

    const selectArray = [
      'JobOrderAssociate.userId',
      'JobOrderAssociate.tenantId',
      'JobOrderAssociate.jobOrderId',
      'JobOrderAssociate.rejected',
      'JobOrderAssociate.createdAt',
      'JobOrderAssociate.interviewDate',
      'JobOrderAssociate.movedBackFromSelect',
      'Status.name',
      'Status.id',
    ];

    const orderByTableAndColumn =
      UtilsHelper.getTableFromSortKey(sortingOptions.sort.key, 'jobOrderAssociate') +
      UtilsHelper.getColumnNameFromSortKey(sortingOptions.sort.key, 'jobOrderAssociate');
    const orderDESCorASC = UtilsHelper.getOrderDirection(sortingOptions);

    let query: SelectQueryBuilder<JobOrderAssociate> = this.q(tenantId).select(selectArray);

    query = UtilsHelper.applyFilter(findIn, findBetween, query, 'jobOrderAssociate');

    if (notIn) {
      query.andWhere(`Status.name NOT IN (:...statuses)`, {statuses: notIn ?? []});
    }

    if ((loadedCandidateIds ?? []).length > 0) {
      query.andWhere(`JobOrderAssociate.userId NOT IN (:...loadedCandidateIds)`, {loadedCandidateIds});
    }

    query.andWhere('"JobOrderAssociate"."jobOrderId" = :jobOrderId', {jobOrderId});

    query = query
      .leftJoinAndSelect('JobOrderAssociate.status', 'Status')
      .leftJoinAndSelect('JobOrderAssociate.jobOrderAssociateCases', 'JobOrderAssociateCase')
      .leftJoinAndSelect('JobOrderAssociateCase.case', 'Case')
      .leftJoinAndSelect('Case.caseCategory', 'CaseCategory')
      .skip(0)
      .take(paginatorOptions.itemsPerPage)
      .orderBy(orderByTableAndColumn, orderDESCorASC);

    const [results, total] = await query.getManyAndCount();

    return new Pagination<JobOrderAssociatesDto>({
      results: results.map(
        ({userId, createdAt, status, interviewDate, movedBackFromSelect, jobOrderAssociateCases, rejected}) => {
          return {
            associateId: userId,
            name: null,
            status: status.name,
            statusId: status.id,
            rejected,
            createdAt,
            interviewDate,
            movedBackFromSelect,
            jobOrderAssociateCases,
          };
        },
      ),
      total,
    });
  }

  public async deleteAllJobOrderAssociates(tenantId: number, jobOrderId: string) {
    return this.q(tenantId).andWhere('jobOrderId = :jobOrderId', {jobOrderId}).delete().execute();
  }

  public async deleteAllJobOrdersAssociates(tenantId: number, jobOrderIds: string[]) {
    return jobOrderIds.length
      ? this.q(tenantId).andWhere('jobOrderId IN (:...jobOrderIds)', {jobOrderIds}).delete().execute()
      : '';
  }
}
