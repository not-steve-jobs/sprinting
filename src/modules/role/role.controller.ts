import {Controller, Get} from '@nestjs/common';
import {RoleService} from './role.service';
import {RoleDto} from './dto/role.dto';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';

@ApiTags('Role')
@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Get all roles'})
  @Get('/roles')
  async getAllRoles(): Promise<RoleDto[]> {
    return await this.roleService.getAll();
  }
}
