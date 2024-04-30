import {Controller, Param, ParseIntPipe, Body, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from 'src/core/auth/authScopes';
import {GetRegionWageDto} from './dto/getRegionWage.dto';
import {RegionWageDto} from './dto/regionWage.dto';
import {RegionWageService} from './regionWage.service';

@ApiTags('RegionWage')
@Controller()
export class RegionWageController {
  constructor(private readonly RegionWageService: RegionWageService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving region wage recommendations'})
  @Post('/tenant/:tenantId/wage/minimum-wage')
  async fetchMinimumWage(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() payload: GetRegionWageDto,
  ): Promise<RegionWageDto> {
    return this.RegionWageService.getRegionWage(tenantId, payload);
  }
}
