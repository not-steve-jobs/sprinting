import {Permission} from 'src/core/permission/permission.decorator';
import {Controller, Get, Param, Body, Post, ParseIntPipe, UseInterceptors, ParseUUIDPipe} from '@nestjs/common';
import {InvoiceService} from './invoice.service';
import {InvoiceDto} from './dto/invoice.dto';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ListingDto, FilterDto} from './../common/listing.dto';
import {FileHeadersInterceptor} from '../../core/fileHeaders.interceptor';
import {GenerateXlsxDto} from '../../helpers/export.helper';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {Pagination} from '../common/paginate';
import {Invoice} from './invoice.entity';
import {ContextService} from 'src/core/context/context.service';
import {GenerateXlsxOptions} from 'src/core/generateXlsxOptions.interface';
import {Permission as PermissionEnum} from '../permission/permission.enum';

@ApiTags('Invoice')
@Controller()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService, private readonly contextService: ContextService) {}

  @Permission({permName: PermissionEnum.Invoices})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving Invoices'})
  @Post('/tenant/:tenantId/invoices')
  public async fetch(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() payload: ListingDto,
  ): Promise<Pagination<InvoiceDto>> {
    return this.invoiceService.fetchInvoice(
      tenantId,
      {page: payload.page, itemsPerPage: payload.itemsPerPage},
      {sort: payload.sort},
      {filter: payload.filter},
      this.contextService.tenantUserContext.tenantUser,
    );
  }

  @Permission({permName: PermissionEnum.Invoices})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving Invoice'})
  @Get('/tenant/:tenantId/invoice/:invoiceId')
  async get(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('invoiceId', ParseUUIDPipe) invoiceId: string,
  ): Promise<InvoiceDto> {
    return this.invoiceService.get(tenantId, invoiceId);
  }

  @Permission({permName: PermissionEnum.Invoices})
  @Auth(AuthScopes.roleUser)
  @Post('/invoices/generate-xlsx')
  @ApiOperation({summary: 'Handler for generating invoice excel file'})
  @UseInterceptors(FileHeadersInterceptor)
  public async generateXlsx(@Body() body: GenerateXlsxOptions): Promise<GenerateXlsxDto> {
    return this.invoiceService.generateXlsx(body);
  }

  @Permission({permName: PermissionEnum.Invoices})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving Invoices chart data'})
  @Post('/tenant/:tenantId/invoices/chart')
  public async fetchChart(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() payload: FilterDto,
  ): Promise<Invoice[]> {
    return this.invoiceService.fetchInvoiceChart(tenantId, {filter: payload});
  }
}
