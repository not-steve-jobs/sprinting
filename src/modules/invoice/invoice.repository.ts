import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {AbstractRepository, EntityRepository, In, SelectQueryBuilder} from 'typeorm';
import {Invoice} from './invoice.entity';
import {Pagination, PaginationOptions, SortingOptions, FilteringOptions} from '../common/paginate';
import {UtilsHelper} from '../../helpers/utils.helper';
import {InvoiceDto} from './dto/invoice.dto';
import * as dateFns from 'date-fns';

@EntityRepository(Invoice)
export class InvoiceRepository extends AbstractRepository<Invoice> {
  private q(tenantId: number): SelectQueryBuilder<Invoice> {
    return this.createQueryBuilder('Invoice').where('"Invoice"."tenantId" = :tenantId', {tenantId});
  }

  public async findAll(tenantId: number): Promise<Invoice[]> {
    return this.q(tenantId).getMany();
  }

  public async findManyById(ids: string[]): Promise<Invoice[]> {
    return this.manager.find(Invoice, {
      where: {
        id: In(ids),
      },
    });
  }

  public async findOne(tenantId: number, id: string): Promise<Invoice> {
    return this.manager.findOne(Invoice, {where: {tenantId, id}});
  }

  public async findOneByInvoiceNumber(tenantId: number, number: string): Promise<Invoice> {
    return this.q(tenantId).andWhere('"number" = :number', {number}).getOne();
  }

  public async findOneById(tenantId: number, id: string): Promise<Invoice> {
    return this.q(tenantId).andWhere('"id" = :id', {id}).getOne();
  }

  public async findManyByIds(tenantId: number, ids: string[], relations: string[] = []): Promise<Invoice[]> {
    return this.manager.find(Invoice, {
      where: {
        tenantId,
        id: In(ids),
      },
      relations,
    });
  }

  public async fetchInvoices(
    tenantId: number,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    tenantUser: TenantUser,
  ): Promise<Pagination<InvoiceDto>> {
    const {findBetween, findIn} = filteringOptions.filter || {};
    const tenantUserLocationIds = tenantUser.tenantUserLocations.map(({locationId}) => locationId);

    const selectArray: string[] = [
      'Invoice.id',
      'Invoice.tenantId',
      'Invoice.number',
      'Invoice.attachments',
      'Invoice.createdAt',
      'Invoice.updatedAt',
      'Invoice.creditNotes',
      'Invoice.duePaymentDate',
      'Invoice.hoursBilled',
      'Invoice.issueDate',
      'Invoice.periodEnd',
      'Invoice.periodStart',
      'Invoice.totalAmount',
      'Invoice.amountBeforeTax',
      'Invoice.currency',
      'Status.name',
      'Status.id',
      'Location.id',
      'Location.locationName',
    ];
    const orderByTableAndColumn =
      UtilsHelper.getTableFromSortKey(sortingOptions.sort.key, 'invoice') +
      UtilsHelper.getColumnNameFromSortKey(sortingOptions.sort.key, 'invoice');
    const orderDESCorASC = UtilsHelper.getOrderDirection(sortingOptions);

    let query: SelectQueryBuilder<Invoice> = this.q(tenantId).select(selectArray);

    query = UtilsHelper.applyFilter(findIn, findBetween, query, 'invoice');

    query.andWhere('"Invoice"."locationId" = ANY (:tenantUserLocationIds)', {tenantUserLocationIds});

    query = query
      .leftJoin('Invoice.status', 'Status')
      .leftJoin('Invoice.location', 'Location')
      .take(paginatorOptions.itemsPerPage)
      .skip((paginatorOptions.page - 1) * paginatorOptions.itemsPerPage)
      .orderBy(orderByTableAndColumn, orderDESCorASC);

    const [results, total] = await query.getManyAndCount();

    return new Pagination<any>({
      results: results.map(({status, location, ...rest}) => {
        const overdueDaysNumber = dateFns.differenceInDays(new Date(), rest.duePaymentDate) * -1;

        return {
          overdue: `${overdueDaysNumber} days`,
          overdueDaysNumber,
          status: status.name,
          statusId: status.id,
          locationId: location.id,
          location: location.locationName,
          ...rest,
        };
      }),
      total,
    });
  }

  public async fetchInvoicesChartData(tenantId: number, filteringOptions: FilteringOptions): Promise<Invoice[]> {
    // start prepare filter properties
    const {findBetween, findIn, findLike} = filteringOptions.filter || {};
    const filters = UtilsHelper.generateFilters({findBetween, findLike, findIn});
    // end   prepare filter properties

    const results = await this.manager.find(Invoice, {
      where: {
        tenantId,
        ...filters,
      },
    });

    return results.map((x: any) => new Invoice(x));
  }

  public async save(entity: Invoice) {
    return this.manager.save(entity);
  }

  public async delete(entity: Invoice) {
    return this.manager.remove(entity);
  }
}
