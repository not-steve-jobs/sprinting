import {Controller, Param, ParseIntPipe, Get} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from 'src/core/auth/authScopes';
import {AvailableWorkersDto} from './dto/availableWorkers.dto';
import {AvailableWorkersService} from './availableWorkers.service';

@ApiTags('AvailableWorkers')
@Controller()
export class AvailableWorkersController {
  constructor(private readonly availableWorkersService: AvailableWorkersService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving available workers'})
  @Get('/tenant/:tenantId/role/:jobRoleId/available-workers')
  async getAvailableWorkersForRole(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('jobRoleId') jobRoleId: string,
  ): Promise<AvailableWorkersDto> {
    return this.availableWorkersService.getAvailableWorkersForRole(tenantId, jobRoleId);
  }
}
