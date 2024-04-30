import {LocationBranchDto} from './dto/locationBranch.dto';
import {LocationBranchService} from './locationBranch.service';
import {Controller, Get, Param, ParseIntPipe, ParseUUIDPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';

@ApiTags('Location Branch')
@Controller()
export class LocationBranchController {
  constructor(private readonly locationBranchService: LocationBranchService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving all branches for specific tenant and client'})
  @Get('/tenant/:tenantId/client/:clientId/branches')
  public async getBranches(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('clientId', ParseUUIDPipe) clientId: string,
  ): Promise<LocationBranchDto[]> {
    return this.locationBranchService.getBranches(tenantId, clientId);
  }
}
