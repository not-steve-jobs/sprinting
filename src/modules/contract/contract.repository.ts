import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {AbstractRepository, EntityRepository, In, SelectQueryBuilder} from 'typeorm';
import {Contract} from './contract.entity';
import {Pagination, PaginationOptions, SortingOptions, FilteringOptions} from '../common/paginate';
import {UtilsHelper} from '../../helpers/utils.helper';

@EntityRepository(Contract)
export class ContractRepository extends AbstractRepository<Contract> {
  private q(tenantId: number): SelectQueryBuilder<Contract> {
    return this.createQueryBuilder('Contract').where('"Contract"."tenantId" = :tenantId', {tenantId});
  }

  public async findAll(tenantId: number): Promise<Contract[]> {
    return this.q(tenantId).getMany();
  }

  public async findOne(tenantId: number, id: string): Promise<Contract> {
    return this.manager.findOne(Contract, {where: {tenantId, id}});
  }

  public async findOneByContractNumber(tenantId: number, number: string): Promise<Contract> {
    return this.q(tenantId).andWhere('"number" = :number', {number}).getOne();
  }

  public async findOneById(tenantId: number, id: string): Promise<Contract> {
    return this.q(tenantId).andWhere('"id" = :id', {id}).getOne();
  }

  public async findManyByIds(tenantId: number, ids: string[], relations: string[] = []): Promise<Contract[]> {
    return this.manager.find(Contract, {
      where: {
        tenantId,
        id: In(ids),
      },
      relations,
    });
  }

  public async fetchContracts(
    tenantId: number,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    tenantUser: TenantUser,
  ): Promise<Pagination<Contract>> {
    const {findBetween, findIn} = filteringOptions.filter || {};
    const tenantUserLocationIds = tenantUser.tenantUserLocations.map(({locationId}) => locationId);

    const selectArray = [
      'Contract.id',
      'Contract.tenantId',
      'Contract.number',
      'Contract.dateStart',
      'Contract.dateEnd',
      'Contract.signatureDate',
      'Contract.associateName',
      'Contract.legalEntity',
      'Contract.signedBy',
      'Contract.roleOfThePersonSign',
      'Contract.clientsName',
      'Contract.VAT',
      'Contract.mainPointOfContract',
      'Contract.serviceType',
      'Contract.service',
      'Status.name',
      'Status.id',
      'Type.name',
      'Location.id',
      'Location.locationName',
    ];

    const orderByTableAndColumn =
      UtilsHelper.getTableFromSortKey(sortingOptions.sort.key, 'contract') +
      UtilsHelper.getColumnNameFromSortKey(sortingOptions.sort.key, 'contract');
    const orderDESCorASC = UtilsHelper.getOrderDirection(sortingOptions);

    let query: SelectQueryBuilder<Contract> = this.q(tenantId).select(selectArray);

    query = UtilsHelper.applyFilter(findIn, findBetween, query, 'contract');

    query.andWhere('"Contract"."locationId" = ANY (:tenantUserLocationIds)', {tenantUserLocationIds});

    query = query
      .leftJoin('Contract.status', 'Status')
      .leftJoin('Contract.type', 'Type')
      .leftJoin('Contract.location', 'Location')
      .take(paginatorOptions.itemsPerPage)
      .skip((paginatorOptions.page - 1) * paginatorOptions.itemsPerPage)
      .orderBy(orderByTableAndColumn, orderDESCorASC);

    const [results, total] = await query.getManyAndCount();

    return new Pagination<any>({
      results: results.map(({status, type, location, ...rest}) => {
        return {
          ...rest,
          status: status.name,
          statusId: status.id,
          type: type?.name,
          locationId: location.id,
          location: location.locationName,
        };
      }),
      total,
    });
  }

  public async save(entity: Contract) {
    return this.manager.save(entity);
  }

  public async delete(entity: Contract) {
    return this.manager.remove(entity);
  }
}
