import {JobOrderAssociatesDto} from '../jobOrderAssociate/dto/jobOrderAssociates.dto';
import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFiles,
  UsePipes,
  Query,
} from '@nestjs/common';
import {JobOrderService} from './jobOrder.service';
import {JobOrderDto} from './dto/jobOrder.dto';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {UpsertJobOrderDto, UpsertDraftJobOrderDto} from './dto/upsertJobOrder.dto';
import {JobOrderListingDto} from './dto/jobOrderListing.dto';
import {FileHeadersInterceptor} from '../../core/fileHeaders.interceptor';
import {GenerateXlsxDto} from '../../helpers/export.helper';
import {FilesInterceptor} from '@nestjs/platform-express';
import {Permission} from '../../core/permission/permission.decorator';
import {JobOrder} from './jobOrder.entity';
import {Pagination} from '../common/paginate';
import {ContextService} from 'src/core/context/context.service';
import {FilterDto} from '../common/listing.dto';
import {JobOrderCandidatesListingDto} from './dto/jobOrderCandidatesListing.dto';
import {CustomValidationPipe} from './validation.pipe';
import {HtmlSanitizationPipe} from '../../core/sanitization/htmlSanitization.pipe';
import {CloseReasonArgumentsPayload} from '../closeReasonArguments/dto/closeReasonArgumentsPayload.dto';
import {CloseReasonArgumentsDto} from '../closeReasonArguments/dto/closeReasonArguments.dto';
import {GenerateXlsxOptions} from 'src/core/generateXlsxOptions.interface';
import {Permission as PermissionEnum} from '../permission/permission.enum';
import {SimpleJobOrderDto} from './dto/simpleJobOrder.dto';

@ApiTags('Job Order')
@Controller()
export class JobOrderController {
  constructor(private readonly jobOrderService: JobOrderService, private readonly contextService: ContextService) {}

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving Job Order'})
  @Get('/tenant/:tenantId/jobOrder/:jobOrderId')
  async getJobOrder(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('jobOrderId', ParseUUIDPipe) jobOrderId: string,
  ): Promise<JobOrderDto> {
    return this.jobOrderService.getJobOrder(
      tenantId,
      this.contextService.tenantUserContext.tenantUser.user.clientId,
      jobOrderId,
      [
        'jobOrderAssociate',
        'jobOrderAssociate.status',
        'location',
        'jobRole',
        'shift',
        'contractType',
        'branch',
        'experience',
        'serviceType',
        'workType',
        'timeSheetApprover',
        'reportTo',
        'billTo',
      ],
    );
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for creating Job Order'})
  @Post('/tenant/:tenantId/jobOrder/create')
  @UsePipes(CustomValidationPipe)
  @UsePipes(new HtmlSanitizationPipe(['additionalInformation']))
  async create(@Param('tenantId') tenantId: number, @Body() body: UpsertJobOrderDto): Promise<JobOrder> {
    return this.jobOrderService.upsert(tenantId, body);
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for creating draft Job Order'})
  @Post('/tenant/:tenantId/jobOrder/draft')
  @UsePipes(new HtmlSanitizationPipe(['additionalInformation']))
  async createDraft(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() body: UpsertDraftJobOrderDto,
  ): Promise<JobOrder> {
    return this.jobOrderService.upsertDraft(tenantId, body);
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for updating Job Order'})
  @Put('/tenant/:tenantId/jobOrder/:jobOrderId')
  @UsePipes(new HtmlSanitizationPipe(['additionalInformation']))
  async updateJobOrder(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('jobOrderId', ParseUUIDPipe) jobOrderId: string,
    @Body() body: UpsertJobOrderDto,
  ): Promise<JobOrder> {
    return this.jobOrderService.update(tenantId, jobOrderId, body, this.contextService.userContext.id);
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Count Job Orders that match the filtering'})
  @Post('/tenant/:tenantId/client/:clientId/staffing-requests-count')
  public async countJobOrders(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() filter: FilterDto,
  ): Promise<number> {
    return this.jobOrderService.getCount(
      tenantId,
      clientId,
      {filter},
      this.contextService.tenantUserContext.tenantUser,
    );
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving Job Orders'})
  @Post('/tenant/:tenantId/client/:clientId/staffing-requests')
  public async fetchAll(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() payload: JobOrderListingDto,
  ): Promise<Pagination<JobOrder>> {
    return this.jobOrderService.fetchAll(
      tenantId,
      clientId,
      {page: payload.page, itemsPerPage: payload.itemsPerPage},
      {sort: payload.sort},
      {filter: payload.filter},
      this.contextService.tenantUserContext.tenantUser,
    );
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Retrieves job order stubs that start in a specific period'})
  @Get('/tenant/:tenantId/client/:clientId/staffing-requests-period')
  public async getSimpleJobOrdersStartingInPeriod(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<SimpleJobOrderDto[]> {
    return this.jobOrderService.getSimpleJobOrdersStartingInPeriod(
      tenantId,
      clientId,
      from,
      to,
      this.contextService.tenantUserContext.tenantUser,
    );
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for generating staffing request excel file'})
  @Post('/staffing-requests/generate-xlsx')
  @UseInterceptors(FileHeadersInterceptor)
  public async generateStaffingRequestsXlsx(@Body() body: GenerateXlsxOptions): Promise<GenerateXlsxDto> {
    return this.jobOrderService.generateStaffingRequestsXlsx(body);
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for generating order details excel file'})
  @Post('/order-details/generate-xlsx')
  @UseInterceptors(FileHeadersInterceptor)
  public async generateOrderDetailsXlsx(@Body() body: GenerateXlsxOptions): Promise<GenerateXlsxDto> {
    return this.jobOrderService.generateOrderDetailsXlsx(body);
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for deleting staffing request'})
  @Delete('/tenant/:tenantId/jobOrder/:jobOrderId')
  public async delete(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('jobOrderId', ParseUUIDPipe) jobOrderId: string,
  ): Promise<JobOrder> {
    return this.jobOrderService.delete(tenantId, jobOrderId);
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for uploading files on staffing request'})
  @Post('/tenant/:tenantId/jobOrder/:jobOrderId/files-upload')
  @UseInterceptors(FilesInterceptor('files[]'))
  async uploadFiles(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('jobOrderId', ParseUUIDPipe) jobOrderId: string,
    @UploadedFiles() files,
  ): Promise<any> {
    return this.jobOrderService.createFiles(
      tenantId,
      jobOrderId,
      files,
      this.contextService.tenantUserContext.tenantUser.userId,
    );
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all associates which are connected to specific job order'})
  @Get('/tenant/:tenantId/jobOrder/:jobOrderId/associates')
  async fetchAssociates(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('jobOrderId', ParseUUIDPipe) jobOrderId: string,
  ): Promise<JobOrderAssociatesDto[]> {
    return this.jobOrderService.fetchActiveAssociates(tenantId, jobOrderId);
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide associates which are connected to specific job order in the form of pages'})
  @Post('/tenant/:tenantId/jobOrder/:jobOrderId/associates')
  async fetchPaginatedAssociates(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('jobOrderId', ParseUUIDPipe) jobOrderId: string,
    @Body() payload: JobOrderCandidatesListingDto,
  ): Promise<Pagination<JobOrderAssociatesDto>> {
    return this.jobOrderService.fetchActivePaginatedAssociates(
      tenantId,
      jobOrderId,
      {page: 1, itemsPerPage: payload.itemsPerPage},
      {sort: payload.sort},
      {filter: payload.filter},
      payload.loadedCandidateIds,
    );
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide associate data'})
  @Get('/tenant/:tenantId/jobOrder/:jobOrderId/associate/:associateId')
  async fetchJobOrderAssociateData(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('jobOrderId', ParseUUIDPipe) jobOrderId: string,
    @Param('associateId', ParseUUIDPipe) associateId: string,
  ): Promise<JobOrderAssociatesDto> {
    return this.jobOrderService.fetchJobOrderAssociateData(tenantId, jobOrderId, associateId);
  }

  @Auth(AuthScopes.roleUser)
  @Post('/tenant/:tenantId/client/:clientId/stuffing-requests-status')
  @ApiOperation({summary: 'Stuffing request listing, aggregated by status'})
  public async groupByStatus(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() filter: FilterDto,
  ): Promise<any> {
    return this.jobOrderService.groupStuffingRequestsByStatus(tenantId, clientId, {filter: filter});
  }

  /**
   * Closes job order and returns close reason by provided tenant and job order ids (parameters) and close reason data in the payload.
   *
   * @param {number} tenantId - Id of current tenant
   * @param {string} jobOrderId - Id of current job order
   * @param {CloseReasonArgumentsPayload} payload - Data from the request body
   * @returns {Promise<CloseReasonArgumentsDto>} - Promise, retrieving the close reason data
   */
  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for closing a Job Order'})
  @Post('/tenant/:tenantId/closeJobOrder/:jobOrderId')
  public async close(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('jobOrderId', ParseUUIDPipe) jobOrderId: string,
    @Body() payload: CloseReasonArgumentsPayload,
  ): Promise<CloseReasonArgumentsDto> {
    const systemInfo = {
      tenantName: this.contextService.tenantContext.tenant.name,
      userId: this.contextService.userContext.id,
      isClosedFromCLA: true,
    };
    return this.jobOrderService.close(tenantId, jobOrderId, payload, systemInfo);
  }
}
