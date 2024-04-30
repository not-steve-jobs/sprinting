import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {EmploymentTypeDto} from './dto/employmentType.dto';
import {EmploymentTypeService} from './employmentType.service';

@ApiTags('Employment Type')
@Controller()
export class EmploymentTypeController {
  constructor(private readonly employmentTypeService: EmploymentTypeService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retriving employment types'})
  @Get('/tenant/:tenantId/employment-types')
  public async get(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<EmploymentTypeDto[]> {
    return this.employmentTypeService.get(tenantId);
  }
}
