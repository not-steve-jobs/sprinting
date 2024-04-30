import {CandidatesFilterDataDto} from './dto/candidatesFilterData.dto';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Controller, Param, ParseIntPipe, ParseUUIDPipe, Injectable, Patch, Body, Get} from '@nestjs/common';

import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from 'src/core/auth/authScopes';
import {Permission} from 'src/core/permission/permission.decorator';

import {JobOrderAssociate} from './jobOrderAssociate.entity';
import {JobOrderAssociateService} from './jobOrderAssociate.service';
import {JobOrderAssociateStatusDto} from './dto/jobOrderAssociateStatus.dto';
import {Permission as PermissionEnum} from '../permission/permission.enum';

@ApiTags('Job Order Associate')
@Controller()
@Injectable()
export class JobOrderAssociateController {
  public constructor(private readonly jobOrderAssociateService: JobOrderAssociateService) {}

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Change the status of a JobOrderAssociate for specific JobOrder'})
  @Patch('/tenant/:tenantId/jobOrder/:jobOrderId/candidate/:candidateId/status')
  async changeCandidateStatus(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('jobOrderId', ParseUUIDPipe) jobOrderId: string,
    @Param('candidateId', ParseUUIDPipe) candidateId: string,
    @Body() payload: JobOrderAssociateStatusDto,
  ): Promise<JobOrderAssociate> {
    return this.jobOrderAssociateService.changeCandidateStatus(tenantId, jobOrderId, candidateId, payload.statusName);
  }

  @Permission({permName: PermissionEnum.StaffingRequests})
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Get all available data related to candidates - filter related data'})
  @Get('/candidatesFilterData')
  async getCandidatesFilterData(): Promise<CandidatesFilterDataDto> {
    return this.jobOrderAssociateService.getCandidatesFilterData();
  }
}
