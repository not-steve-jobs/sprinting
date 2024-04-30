import {SectorListDto} from './dto/sectorList.dto';
import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {SectorService} from './sector.service';

@ApiTags('Sector')
@Controller()
export class SectorController {
  constructor(private readonly sectorService: SectorService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available sectors for specific tenant'})
  @Get('/tenant/:tenantId/sectors')
  public async getAll(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<SectorListDto[]> {
    return this.sectorService.getAll(tenantId);
  }
}
