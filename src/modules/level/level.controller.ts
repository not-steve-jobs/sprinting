import {LevelDto} from './dto/level.dto';
import {Controller, Get, Param} from '@nestjs/common';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {LevelService} from './level.service';

@ApiTags('Level')
@Controller()
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available levels for specific entity'})
  @Get('/entityName/:entityName/levels')
  public async getAllLevelsByEntityName(@Param('entityName') entityName: string): Promise<LevelDto[]> {
    return this.levelService.getAllLevelsByEntityName(entityName);
  }
}
