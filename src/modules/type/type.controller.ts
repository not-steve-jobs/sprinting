import {AuthScopes} from '../../core/auth/authScopes';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {TypeService} from './type.service';
import {TypeDto} from './dto/type.dto';
import {Auth} from 'src/core/auth/auth.decorator';

@ApiTags('Type')
@Controller()
export class TypeController {
  public constructor(private readonly typeService: TypeService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available types (all entityNames) for specific tenant'})
  @Get('/tenant/:tenantId/types')
  public async getAll(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<TypeDto[]> {
    return this.typeService.getAll(tenantId);
  }
}
