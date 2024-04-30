import {Controller, Body, Post, Param, ParseIntPipe, ParseUUIDPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from '../../core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {NetPromoteScoreService} from './netPromoteScore.service';
import {NetPromoteScoreDto} from './dto/netPromoteScore.dto';
import {CreateNetPromoteScoreDto} from './dto/createNetPromoteScore.dto';

@ApiTags('NetPromoteScore')
@Controller()
export class NetPromoteScoreController {
  constructor(private readonly netPromoteScoreService: NetPromoteScoreService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for creating NetPromoteScoreDto'})
  @Post('/net-promote-score/:tenantId/:userId/nps/create')
  async create(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() nps: CreateNetPromoteScoreDto,
  ): Promise<NetPromoteScoreDto> {
    return await this.netPromoteScoreService.create(tenantId, userId, nps);
  }
}
