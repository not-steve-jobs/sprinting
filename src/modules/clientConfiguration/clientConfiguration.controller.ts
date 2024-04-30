import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {ContextService} from 'src/core/context/context.service';
import {AuthScopes} from '../../core/auth/authScopes';
import {FeatureConfigurationFeature} from '../featureConfiguration/enum/featureConfigurationFeature.enum';
import {ClientConfigurationService} from './clientConfiguration.service';

@ApiTags('Client Configuration')
@Controller()
export class ClientConfigurationController {
  public constructor(
    private readonly service: ClientConfigurationService,
    private readonly contextService: ContextService,
  ) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving client configuration by feature, channel and role'})
  @Get('/tenant/:tenantId/client/:clientId/configuration/:feature/:channel/:roleId')
  public async getOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('clientId') clientId: string,
    @Param('feature') feature: FeatureConfigurationFeature,
    @Param('channel') channel: string,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<any> {
    return this.service.getConfig(tenantId, channel, feature, roleId, clientId);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving client configuration by feature, channel and role'})
  @Get('/tenant/:tenantId/client/:clientId/main-menu')
  public async getMainMenu(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('clientId') clientId: string,
  ): Promise<any> {
    const result = await this.service.getMainMenu(tenantId, clientId, this.contextService.userContext.user?.roleId);
    return result;
  }
}
