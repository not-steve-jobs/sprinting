import {Workplace} from './workplace.entity';
import {Controller, Get, Param, ParseUUIDPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {WorkplaceService} from './workplace.service';

@ApiTags('Workplace')
@Controller()
export class WorkplaceController {
  constructor(private readonly workplaceService: WorkplaceService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Get all workplaces related to one location'})
  @Get('/location/:locationId/workplaces')
  public async getLocationWorkplaces(@Param('locationId', ParseUUIDPipe) locationId: string): Promise<Workplace[]> {
    return this.workplaceService.getAll(locationId);
  }
}
