import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post} from '@nestjs/common';
import {UserConsentService} from './userConsent.service';
import {AuthScopes} from '../../core/auth/authScopes';
import {Auth} from 'src/core/auth/auth.decorator';
import {ConsentDto} from '../consent/dto/consent.dto';
import {UserMarketingConsentDto} from './dto/userMarketingConsent.dto';

@ApiTags('User Consent')
@Controller()
export class UserConsentController {
  constructor(private readonly userConsentService: UserConsentService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for creating User Consent'})
  @Post('/tenant/:tenantId/user/:userId/user-consent')
  public async create(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() payload: ConsentDto[],
  ): Promise<ConsentDto[]> {
    return this.userConsentService.create(tenantId, userId, payload);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving User Marketing Consent value'})
  @Get('/tenant/:tenantId/user/:userId/user-consent/marketing')
  public async getMarketing(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<boolean> {
    return this.userConsentService.getMarketing(tenantId, userId);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for setting User Marketing Consent value'})
  @Post('/tenant/:tenantId/user/:userId/user-consent/marketing')
  public async setMarketing(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() payload: UserMarketingConsentDto,
  ): Promise<boolean> {
    return this.userConsentService.setMarketing(tenantId, userId, payload);
  }
}
