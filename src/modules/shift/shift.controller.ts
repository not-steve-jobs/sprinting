import {ShiftListDto} from './dto/shiftList.dto';
import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {ShiftService} from './shift.service';

@ApiTags('Shift')
@Controller()
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available shifts for specific tenant'})
  @Get('/tenant/:tenantId/shifts')
  public async getAll(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<ShiftListDto[]> {
    return this.shiftService.getAll(tenantId);
  }
}
