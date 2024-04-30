import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {BranchService} from './branch.service';
import {BranchDto} from './dto/branch.dto';

@ApiTags('Branch')
@Controller()
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retriving all branches'})
  @Get('/tenant/:tenantId/branches')
  public async getTenantBranches(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<BranchDto[]> {
    return this.branchService.getAll(tenantId);
  }
}
