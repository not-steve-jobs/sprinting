import {RateListDto} from './dto/rateList.dto';
import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {RateService} from './rate.service';

@ApiTags('Rate')
@Controller()
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available rates for specific tenant'})
  @Get('/tenant/:tenantId/rates')
  public async getAll(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<RateListDto[]> {
    return this.rateService.getAll(tenantId);
  }
}
