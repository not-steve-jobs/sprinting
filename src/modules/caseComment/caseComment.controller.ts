import {
  Controller,
  Body,
  Post,
  Param,
  ParseIntPipe,
  Get,
  UseInterceptors,
  UploadedFiles,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {CaseCommentService} from './caseComment.service';
import {Auth} from '../../core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {CreateCaseCommentDto} from './dto/createCaseComment.dto';
import {CaseCommentDto} from './dto/caseComment.dto';
import {FilesInterceptor} from '@nestjs/platform-express';
import {File} from '../file/file.entity';
import {ContextService} from 'src/core/context/context.service';

@ApiTags('Case Comment')
@Controller()
export class CaseCommentController {
  constructor(
    private readonly caseCommentService: CaseCommentService,
    private readonly contextService: ContextService,
  ) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for creating Case comment'})
  @Post('/tenant/:tenantId/case-comment')
  async create(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() comment: CreateCaseCommentDto,
  ): Promise<CaseCommentDto> {
    return this.caseCommentService.create(tenantId, comment, this.contextService.userContext.id);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving Case comment'})
  @Get('/tenant/:tenantId/case/:caseId/case-comment')
  public async fetch(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('caseId', ParseUUIDPipe) caseId: string,
  ): Promise<CaseCommentDto[]> {
    return this.caseCommentService.fetchCaseComments(tenantId, caseId);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for creating draft Case comment with file upload'})
  @Post('/tenant/:tenantId/user/:userId/case-comment')
  @UseInterceptors(FilesInterceptor('files'))
  async createDraft(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() payload: {caseId: string},
    @UploadedFiles() files,
  ): Promise<CaseCommentDto> {
    return this.caseCommentService.createDraft(tenantId, userId, files, payload);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving draft Case comment'})
  @Get('/tenant/:tenantId/user/:userId/case/:caseId/case-comment')
  public async fetchDraft(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<CaseCommentDto> {
    return this.caseCommentService.fetchDraft(tenantId, userId, caseId);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for deleting Case comment file'})
  @Delete('/tenant/:tenantId/file/:fileId/case-comment')
  async deleteFile(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('fileId', ParseUUIDPipe) fileId: string,
  ): Promise<File> {
    return this.caseCommentService.deleteCommentFile(tenantId, fileId, this.contextService.userContext.user.id);
  }
}
