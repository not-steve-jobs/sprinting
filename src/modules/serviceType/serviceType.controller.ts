import {ServiceTypeListDto} from './dto/serviceTypeList.dto';
import {Body, Controller, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {ServiceTypeService} from './serviceType.service';

@ApiTags('Service Type')
@Controller()
export class ServiceTypeController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available service types for specific tenant'})
  @Get('/tenant/:tenantId/service-types')
  public async getAll(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<ServiceTypeListDto[]> {
    return this.serviceTypeService.getAll(tenantId);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all service types by ID'})
  @Post('/tenant/:tenantId/service-types-id')
  public async getStatusById(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() body: number[],
  ): Promise<ServiceTypeListDto[]> {
    return this.serviceTypeService.getStatusesById(tenantId, body);
  }
}
