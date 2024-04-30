import {Controller, Get, Param, ParseIntPipe, ParseUUIDPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {ReportTokenDto} from './dto/ReportToken.dto';
import {ReportService} from './report.service';

@ApiTags('Authorization')
@Controller()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Auth(AuthScopes.roleAdmin)
  @ApiOperation({summary: 'Handler for retrieving Power BI embed token'})
  @Get('/tenant/:tenantId/user/:userId/getPowerBIToken')
  async getPowerBIToken(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<ReportTokenDto> {
    return this.reportService.getPowerBIToken(tenantId, userId);
  }
}
