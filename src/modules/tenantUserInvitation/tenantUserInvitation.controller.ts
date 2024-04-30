import {Injectable, Param, Controller, ParseUUIDPipe, Post, Get, ParseIntPipe, Body} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {Auth} from '../../core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';

import {TenantUserInvitationDto} from './dto/tenantUserInvitation.dto';
import {CreateTenantUserInvitationDto} from './dto/createTenantUserInvitation.dto';
import {TenantUserInvitationService} from './tenantUserInvitation.service';

@ApiTags('Tenant User Invitation')
@Controller()
@Injectable()
export class TenantUserInvitationController {
  public constructor(private readonly service: TenantUserInvitationService) {}

  @Auth(AuthScopes.roleAdmin)
  @ApiOperation({summary: 'Handler for creating invitations'})
  @Post('/tenant/:tenantId/user/:userId/invitation')
  public async create(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() payload: CreateTenantUserInvitationDto,
  ): Promise<TenantUserInvitationDto> {
    return this.service.create(tenantId, userId, false, undefined, payload.invitedByUserId);
  }

  @ApiOperation({summary: 'Handler for verifying invitations'})
  @Get('tenant/:tenantId/tenantUserInvitation/:id/verify')
  public async verify(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TenantUserInvitationDto> {
    return this.service.verifyInvitationExpiration(tenantId, id);
  }
}
