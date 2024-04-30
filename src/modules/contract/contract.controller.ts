import {Controller, Get, Param, Body, Post, ParseIntPipe, UseInterceptors, ParseUUIDPipe} from '@nestjs/common';
import {ContractService} from './contract.service';
import {ContractDto} from './dto/contract.dto';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ListingDto} from '../common/listing.dto';
import {FileHeadersInterceptor} from '../../core/fileHeaders.interceptor';
import {GenerateXlsxDto} from '../../helpers/export.helper';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {Permission} from 'src/core/permission/permission.decorator';
import {Permission as PermissionEnum} from '../permission/permission.enum';
import {Pagination} from '../common/paginate';
import {Contract} from './contract.entity';
import {ContextService} from 'src/core/context/context.service';
import {GenerateXlsxOptions} from 'src/core/generateXlsxOptions.interface';

@ApiTags('Contract')
@Controller()
export class ContractController {
  constructor(private readonly contractService: ContractService, private readonly contextService: ContextService) {}

  @Permission({permName: PermissionEnum.Contracts})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving contracts with pagination, sort and filtering'})
  @Post('/tenant/:tenantId/contracts')
  public async fetch(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() payload: ListingDto,
  ): Promise<Pagination<Contract>> {
    return this.contractService.fetchContracts(
      tenantId,
      {page: payload.page, itemsPerPage: payload.itemsPerPage},
      {sort: payload.sort},
      {filter: payload.filter},
      this.contextService.tenantUserContext.tenantUser,
    );
  }

  @Permission({permName: PermissionEnum.Contracts})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving contract'})
  @Get('/tenant/:tenantId/contract/:contractId')
  async get(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('contractId', ParseUUIDPipe) contractId: string,
  ): Promise<ContractDto> {
    return await this.contractService.get(tenantId, contractId);
  }

  @Permission({permName: PermissionEnum.Contracts})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for creating contract'})
  @Post('/tenant/:tenantId/contract/create')
  async post(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() upsertContract: ContractDto,
  ): Promise<ContractDto> {
    return await this.contractService.create(tenantId, upsertContract);
  }

  @Permission({permName: PermissionEnum.Contracts})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for generating contract excel file'})
  @Post('/contracts/generate-xlsx')
  @UseInterceptors(FileHeadersInterceptor)
  public async generateXlsx(@Body() body: GenerateXlsxOptions): Promise<GenerateXlsxDto> {
    return await this.contractService.generateXlsx(body);
  }
}
