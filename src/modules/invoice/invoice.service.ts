import {Injectable} from '@nestjs/common';
import {Invoice} from './invoice.entity';
import {InvoiceRepository} from './invoice.repository';
import {InvoiceDto} from './dto/invoice.dto';
import {ExportHelper, GenerateXlsxDto} from '../../helpers/export.helper';
import {Pagination, PaginationOptions, SortingOptions, FilteringOptions} from './../common/paginate';
import {InvoiceError} from './invoice.error';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {InvoicesXlsxDto, InvoiceXlsxDto} from './dto/invoiceXlsx.dto';
import * as dateFns from 'date-fns';
import {GenerateXlsxOptions} from 'src/core/generateXlsxOptions.interface';
import {XlsxTemplateNames} from 'src/core/xlsxTemplateNames.enum';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository, private readonly exportHelper: ExportHelper) {}

  async fetchInvoice(
    tenantId: number,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    tenantUser: TenantUser,
  ): Promise<Pagination<InvoiceDto>> {
    try {
      return await this.invoiceRepository.fetchInvoices(
        tenantId,
        paginatorOptions,
        sortingOptions,
        filteringOptions,
        tenantUser,
      );
    } catch (error) {
      throw new InvoiceError.InvoicesFetchError(null, error);
    }
  }

  async fetchInvoiceChart(tenantId: number, filteringOptions: FilteringOptions): Promise<Invoice[]> {
    try {
      return await this.invoiceRepository.fetchInvoicesChartData(tenantId, filteringOptions);
    } catch (error) {
      throw new InvoiceError.InvoicesFetchChartDataError(null, error);
    }
  }

  async get(tenantId: number, invoiceId: string): Promise<Invoice> {
    return new Invoice(await this.invoiceRepository.findOne(tenantId, invoiceId));
  }

  public async generateXlsx(options: GenerateXlsxOptions): Promise<GenerateXlsxDto> {
    const {tenantId, entityIds} = options;
    const relations = ['status'];

    try {
      const invoicesData = await this.invoiceRepository.findManyByIds(tenantId, entityIds, relations);
      const invoicesXlsxData = this.generateInvoicesXlsxData(invoicesData);

      return await this.exportHelper.generateXlsx(invoicesXlsxData, XlsxTemplateNames.Invoices);
    } catch (error) {
      throw new InvoiceError.InvoicesExportError(null, error);
    }
  }

  /**
   * Generates the data that the XLSX file will contain.
   *
   * @param {Array<Invoice>} invoicesData - Records from Invoice repository.
   * @returns {InvoicesXlsxDto} - The data that will be included in the XLSX file.
   */
  private generateInvoicesXlsxData(invoicesData: Invoice[]): InvoicesXlsxDto {
    const dateFormatLong = 'PPPPp';
    const dateFormatShort = 'dd MMM yyyy';
    const title = `Invoices report - ${dateFns.format(new Date(), dateFormatLong)}`;
    const data = invoicesData.map(
      (data): InvoiceXlsxDto => {
        return {
          invoiceNumber: data.number ?? '',
          invoicePeriod: '',
          hoursBilled: data.hoursBilled ?? 0,
          invoiceStatus: data.status?.name ?? '',
          duePaymentDate: dateFns.format(data.duePaymentDate, dateFormatShort) ?? '',
          invoiceAttachments: '',
        };
      },
    );

    return {title, data};
  }
}
