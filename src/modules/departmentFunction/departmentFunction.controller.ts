import {Controller, Get, Param, ParseUUIDPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {DepartmentFunctionService} from './departmentFunction.service';
import {DepartmentFunctionDto} from './dto/departmentFunction.dto';

@ApiTags('Department Function')
@Controller()
export class DepartmentFunctionController {
  constructor(private readonly functionService: DepartmentFunctionService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'All department functions'})
  @Get('/department-function')
  public async findAll(): Promise<DepartmentFunctionDto[]> {
    return this.functionService.findAll();
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Get department functions by id'})
  @Get('/department-function/:id')
  public async getFunctionByCode(@Param('id', ParseUUIDPipe) id: string): Promise<DepartmentFunctionDto> {
    return this.functionService.getFunctionById(id);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'All department functions by department id'})
  @Get('/department/:departmentId/functions')
  public async getFunctionsByDepartmentCode(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
  ): Promise<DepartmentFunctionDto[]> {
    return this.functionService.getFunctionsByDepartmentId(departmentId);
  }
}
