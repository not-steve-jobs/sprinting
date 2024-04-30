import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {AbstractRepository, EntityRepository, SelectQueryBuilder, Brackets} from 'typeorm';
import {FilteringOptions, Pagination, PaginationOptions, SortingOptions} from '../common/paginate';
import {UtilsHelper} from '../../helpers/utils.helper';
import {Case} from './case.entity';

@EntityRepository(Case)
export class CaseRepository extends AbstractRepository<Case> {
  private q(tenantId: number): SelectQueryBuilder<Case> {
    return this.createQueryBuilder('Case').where('"Case"."tenantId" = :tenantId', {tenantId});
  }

  public async fetchCases(
    tenantId: number,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    tenantUser: TenantUser,
  ): Promise<Pagination<Case>> {
    const {findBetween, findIn} = filteringOptions.filter || {};
    const columnNameFromSortKey = UtilsHelper.getColumnNameFromSortKey(sortingOptions.sort.key, 'case');
    const tableFromSortKey = UtilsHelper.getTableFromSortKey(sortingOptions.sort.key, 'case');
    const {
      userId,
      tenantUserLocations,
      user: {clientId},
    } = tenantUser;
    const tenantUserLocationIds = tenantUserLocations.map(({locationId}) => locationId);

    let orderByTableAndColumn;
    if (Array.isArray(columnNameFromSortKey)) {
      orderByTableAndColumn = columnNameFromSortKey.map((columnName) => {
        return `${tableFromSortKey || 'Case.'}${columnName}`;
      });
    } else {
      orderByTableAndColumn = `${tableFromSortKey || 'Case.'}${columnNameFromSortKey || sortingOptions.sort.key}`;
    }

    const orderDESCorASC = UtilsHelper.getOrderDirection(sortingOptions);

    let query: any = this.q(tenantId).select([
      'Case',
      'User.id',
      'UserProfile.firstName',
      'UserProfile.lastName',
      'Status.name',
      'CaseCategory.name',
      'Location.locationName',
    ]);

    query = UtilsHelper.applyFilter(findIn, findBetween, query, 'case');

    query.andWhere(
      new Brackets((qb) => {
        qb.where('"Case"."locationId" = ANY (:tenantUserLocationIds)', {tenantUserLocationIds});
        qb.orWhere(
          // list all general feedback cases which have tenantUser.user with same clientId as logged user
          new Brackets((qb1) => {
            qb1.where('Case.locationId is null');
            qb1.andWhere('"User"."clientId" = :clientId', {clientId});
          }),
        );
      }),
    );

    query = query
      .innerJoinAndSelect('Case.tenantUser', 'TenantUser')
      .innerJoin('TenantUser.user', 'User')
      .innerJoin('User.userProfile', 'UserProfile')
      .innerJoin('Case.status', 'Status')
      .innerJoin('Case.caseCategory', 'CaseCategory')
      .leftJoin('Case.location', 'Location')
      .leftJoinAndSelect(
        'Case.caseFollowers',
        'CaseFollower',
        'CaseFollower.tenantId = :tenantId AND CaseFollower.userId = :userId',
        {
          tenantId,
          userId,
        },
      )
      .take(paginatorOptions.itemsPerPage)
      .skip((paginatorOptions.page - 1) * paginatorOptions.itemsPerPage);

    if (!Array.isArray(orderByTableAndColumn)) {
      query = query.orderBy(orderByTableAndColumn, orderDESCorASC);
    } else {
      orderByTableAndColumn.forEach((tableAndColumn) => {
        query = query.orderBy(tableAndColumn);
      });
    }

    query = query.getManyAndCount();

    const [results, total] = await query;

    const newResult = results.map((cases: any) => {
      return {
        ...cases,
        nameAndImage: {
          image: cases.tenantUser.user.userProfile.profileImageUrl,
          name: `${cases.tenantUser.user.userProfile.firstName} ${cases.tenantUser.user.userProfile.lastName}`,
        },
        id: cases.id,
        tenantId: cases.tenantId,
        user: undefined,
        status: cases.status.name,
        caseCategory: cases.caseCategory.name,
        location: cases.location?.locationName,
      };
    });

    return new Pagination<any>({
      results: newResult,
      total,
    });
  }

  public async findOneById(tenantId: number, id: string): Promise<any> {
    return this.q(tenantId)
      .andWhere('"Case"."id" = :id', {id})
      .leftJoinAndSelect('Case.tenantUser', 'TenantUser')
      .leftJoinAndSelect('TenantUser.user', 'User')
      .leftJoinAndSelect('User.userProfile', 'UserProfile')
      .leftJoinAndSelect('Case.comments', 'Comments', 'Comments.isDraft = false')
      .leftJoinAndSelect('Comments.tenantUser', 'CommentTenantUser')
      .leftJoinAndSelect('CommentTenantUser.user', 'CommentUser')
      .leftJoinAndSelect('CommentUser.userProfile', 'CommentUserProfile')
      .leftJoinAndSelect('Case.status', 'Status')
      .leftJoinAndSelect('Case.caseCategory', 'CaseCategory')
      .leftJoinAndSelect('Case.location', 'Location')
      .addOrderBy('Comments.createdAt', 'DESC')
      .getOne();
  }

  public async findOne(tenantId: number, id: string): Promise<Case> {
    return this.manager.findOne(Case, {
      where: {
        tenantId,
        id,
      },
    });
  }

  public async save(entity: Case) {
    return this.manager.save(entity);
  }

  public async delete(entity: Case) {
    return this.manager.remove(entity);
  }

  public async deleteMultiple(userIds: string[]) {
    return userIds.length
      ? this.createQueryBuilder('Case').andWhere('userId IN (:...userIds)', {userIds}).delete().execute()
      : '';
  }

  public async getUserCases(userId: string) {
    return this.createQueryBuilder('Case').andWhere('"Case"."userId" = :userId', {userId}).getMany();
  }
}
