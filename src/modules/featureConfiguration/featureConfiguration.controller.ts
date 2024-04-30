import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Body, Controller, Get, Param, ParseIntPipe, Post} from '@nestjs/common';

import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';

import {FeatureConfigurationService} from './featureConfiguration.service';
import {FeatureConfigurationDto} from './dto/featureConfiguration.dto';
import {GetManyFeatureConfigurationsDto} from './dto/getManyFeatureConfigurations.dto';

@ApiTags('Feature Configuration')
@Controller()
export class FeatureConfigurationController {
  public constructor(private readonly service: FeatureConfigurationService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving feature configuration by feature and channel'})
  @Get('/tenant/:tenantId/featureConfiguration/:feature/:channel')
  public async getOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('feature') feature: string,
    @Param('channel') channel: string,
  ): Promise<FeatureConfigurationDto> {
    return this.service.getOne(tenantId, channel, feature);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving multiple feature configurations by feature and channel'})
  @Post('/tenant/:tenantId/featureConfiguration/features')
  public async getMany(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() payload: GetManyFeatureConfigurationsDto,
  ): Promise<FeatureConfigurationDto[]> {
    return this.service.getMany(tenantId, payload.query);
  }
}
