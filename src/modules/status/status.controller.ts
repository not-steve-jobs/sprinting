import {AuthScopes} from '../../core/auth/authScopes';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {StatusService} from './status.service';
import {StatusDto} from './dto/status.dto';
import {Auth} from 'src/core/auth/auth.decorator';
@ApiTags('Status')
@Controller()
export class StatusController {
  public constructor(private readonly statusService: StatusService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available statuses (all entityNames) for specific tenant'})
  @Get('/tenant/:tenantId/statuses')
  public async getAll(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<StatusDto[]> {
    return this.statusService.getAll(tenantId);
  }
}
