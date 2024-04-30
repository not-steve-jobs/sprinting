import {Controller, Injectable, Post, Body, ParseIntPipe, Param} from '@nestjs/common';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from 'src/core/auth/authScopes';
import {CreateJobOrderAssociateCaseDto} from './dto/createJobOrderAssociateCase.dto';
import {JobOrderAssociateCaseService} from './jobOrderAssociateCase.service';

@ApiTags('Job Order Associate Case')
@Controller()
@Injectable()
export class JobOrderAssociateCaseController {
  public constructor(private readonly jobOrderAssociateCaseService: JobOrderAssociateCaseService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for creating job order associate case'})
  @Post('/tenant/:tenantId/job-order-associate-case')
  async addCaseForCandidate(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() payload: CreateJobOrderAssociateCaseDto,
  ) {
    this.jobOrderAssociateCaseService.create(payload);
  }
}
