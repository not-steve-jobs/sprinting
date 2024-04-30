import {
  Controller,
  Body,
  Post,
  Param,
  ParseIntPipe,
  Get,
  Patch,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {CaseDto} from './dto/case.dto';
import {CaseService} from './case.service';
import {createCaseDto} from './dto/createCase.dto';
import {Auth} from '../../core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {ListingDto} from '../common/listing.dto';
import {UpdateCaseDto} from './dto/updateCase.dto';
import {Pagination} from '../common/paginate';
import {Case} from './case.entity';
import {FilesInterceptor} from '@nestjs/platform-express';
import {CaseCommentDto} from '../caseComment/dto/caseComment.dto';
import {ContextService} from 'src/core/context/context.service';

@ApiTags('Case')
@Controller()
export class CaseController {
  constructor(private readonly caseService: CaseService, private readonly contextService: ContextService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for creating Case'})
  @Post('/tenant/:tenantId/case')
  async create(@Param('tenantId', ParseIntPipe) tenantId: number, @Body() cases: createCaseDto): Promise<CaseDto> {
    return await this.caseService.create(tenantId, cases);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving Cases'})
  @Post('/tenant/:tenantId/cases')
  public async fetch(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() payload: ListingDto,
  ): Promise<Pagination<Case>> {
    return this.caseService.fetchCases(
      tenantId,
      {page: payload.page, itemsPerPage: payload.itemsPerPage},
      {sort: payload.sort},
      {filter: payload.filter},
      this.contextService.tenantUserContext.tenantUser,
    );
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for updating Case'})
  @Patch('/tenant/:tenantId/case/:caseId')
  public async update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Body() payload: UpdateCaseDto,
  ): Promise<CaseDto> {
    return this.caseService.updateCase(tenantId, caseId, payload);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving Case'})
  @Get('/tenant/:tenantId/case/:caseId')
  public async get(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('caseId', ParseUUIDPipe) caseId: string,
  ): Promise<CaseDto> {
    return this.caseService.get(tenantId, caseId, this.contextService.tenantUserContext.tenantUser.userId);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for creating case files'})
  @Post('/tenant/:tenantId/user/:userId/case')
  @UseInterceptors(FilesInterceptor('files'))
  async createDraft(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() payload: {caseId: string},
    @UploadedFiles() files,
  ): Promise<CaseCommentDto> {
    return this.caseService.createFile(tenantId, userId, files, payload);
  }
}
