import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from '../../core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {TenantUserPermissionService} from './tenantUserPermission.service';
import {JobContactDto} from './dto/jobContact.dto';

@ApiTags('Tenant User Permission')
@Controller()
export class TenantUserPermissionController {
  constructor(private readonly tenantUserPermissionService: TenantUserPermissionService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available job contacts'})
  @Get('/tenant/:tenantId/job-contacts')
  /**
   * Returns all job contacts for a given tenant id.
   *
   * @param {number} tenantId - Tenant id to use for filtering
   * @returns {Promise<JobContactDto[]>} - Promise, retrieving job contacts
   */
  public async getAll(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<JobContactDto[]> {
    return this.tenantUserPermissionService.getAvailableJobContacts(tenantId);
  }
}
