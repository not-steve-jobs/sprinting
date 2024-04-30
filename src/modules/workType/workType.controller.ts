import {WorkType} from './workType.entity';
import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {WorkTypeService} from './workType.service';

@ApiTags('WorkType')
@Controller()
export class WorkTypeController {
  constructor(private readonly workTypeService: WorkTypeService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Get all work types'})
  @Get('/tenant/:tenantId/work-types')
  public async getTenantWorkTypes(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<WorkType[]> {
    return this.workTypeService.getAll(tenantId);
  }
}
