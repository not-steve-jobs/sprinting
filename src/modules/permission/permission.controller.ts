import {PermissionListDto} from './dto/permissionList.dto';
import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {PermissionService} from './permission.service';
import {AuthScopes} from '../../core/auth/authScopes';
import {Auth} from 'src/core/auth/auth.decorator';
import {PermissionScopes} from 'src/core/permission/permissionScopes';

@ApiTags('Permission')
@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available permissions for specific tenant'})
  @Get('/tenant/:tenantId/all-permissions')
  public async getAll(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<PermissionListDto[]> {
    return this.permissionService.getPermissionsByName(tenantId, PermissionScopes.getUserPermissionNames());
  }
}
