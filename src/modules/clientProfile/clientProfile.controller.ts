import {Controller, Get, Param, Body, ParseIntPipe, ParseUUIDPipe, Patch} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ClientProfileService} from './clientProfile.service';
import {ClientProfileDto} from './dto/clientProfile.dto';
import {UpdateClientProfileDto} from './dto/updateClientProfile.dto';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';

@ApiTags('Client Profile')
@Controller()
export class ClientProfileController {
  constructor(private readonly clientProfileService: ClientProfileService) {}

  @Auth(AuthScopes.roleAdmin)
  @ApiOperation({summary: 'Handler for updating Client'})
  @Patch('/tenant/:tenantId/client/:clientId')
  async update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() body: UpdateClientProfileDto,
  ): Promise<ClientProfileDto> {
    return this.clientProfileService.update(tenantId, clientId, body);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving Client'})
  @Get('/tenant/:tenantId/client/:clientId')
  async get(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('clientId', ParseUUIDPipe) clientId: string,
  ): Promise<ClientProfileDto> {
    return this.clientProfileService.getOneOrFail(tenantId, clientId);
  }
}
