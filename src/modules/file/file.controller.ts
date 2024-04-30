import {Controller, Post, Param, ParseIntPipe, Get, Body, ParseUUIDPipe, Delete} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {FileService} from './file.service';
import {File} from './file.entity';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {TenantService} from '../tenant/tenant.service';
import {ContextService} from 'src/core/context/context.service';
import {GetTenantDocumentDto} from '../person/dto/getTenantDocument.dto';
import {GetFilesDto} from './dto/getFiles.dto';

@ApiTags('File')
@Controller()
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly tenantService: TenantService,
    private readonly contextService: ContextService,
  ) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving File by file name'})
  @Post('/tenant/:tenantId/file')
  async get(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() payload: {filePathAndName: string},
  ): Promise<GetTenantDocumentDto> {
    return this.fileService.getFileByName(tenantId, payload.filePathAndName);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving File by Case id'})
  @Get('/tenant/:tenantId/case/:caseId/files')
  async getFileByCaseId(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('caseId', ParseUUIDPipe) caseId: string,
  ): Promise<GetFilesDto> {
    return this.fileService.fetchFilesByCaseId(tenantId, caseId);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for deleting a file by tenantId and fileId'})
  @Delete('/tenant/:tenantId/file/:fileId')
  async delete(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('fileId', ParseUUIDPipe) fileId: string,
  ): Promise<File> {
    return this.fileService.deleteFile(tenantId, fileId, this.contextService.userContext.user.id);
  }
}
