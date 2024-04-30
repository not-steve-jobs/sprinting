import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Injectable, Param, Controller, Get, ParseIntPipe} from '@nestjs/common';
import {AuthScopes} from '../../core/auth/authScopes';
import {Auth} from '../../core/auth/auth.decorator';
import {CloseReasonService} from './closeReason.service';
import {CloseReason} from './closeReason.entity';

@ApiTags('Close Reason')
@Controller()
@Injectable()
export class CloseReasonController {
  public constructor(private readonly closeReasonService: CloseReasonService) {}

  /**
   * Returns all internal close reasons for the given tenant id.
   *
   * @param {number} tenantId - Id of current tenant
   * @returns {Promise<CloseReason[]>} - Promise, retrieving the data
   */
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available internal close reasons'})
  @Get('/tenant/:tenantId/close-reasons/internal')
  public async getAllInternal(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<CloseReason[]> {
    return this.closeReasonService.getAllInternal(tenantId);
  }

  /**
   * Returns all external close reasons for the given tenant id. Not a required endpoint for now, but might be needed in the future.
   *
   * @param {number} tenantId - Id of current tenant
   * @returns {Promise<CloseReason[]>} - Promise, retrieving the data
   */
  /*@Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available external close reasons'})
  @Get('/tenant/:tenantId/close-reasons/external')
  public async getAllExternal(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<CloseReason[]> {
    return this.closeReasonService.getAllExternal(tenantId);
  }*/
}
