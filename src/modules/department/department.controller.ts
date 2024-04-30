import {Controller, Get, Param, ParseUUIDPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {DepartmentDto} from './dto/department.dto';
import {DepartmentService} from './department.service';

@ApiTags('Department')
@Controller()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retriving departments'})
  @Get('/department')
  findAll(): Promise<DepartmentDto[]> {
    return this.departmentService.findAll();
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retriving department'})
  @Get('/department/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<DepartmentDto> {
    return this.departmentService.findOne(id);
  }
}
