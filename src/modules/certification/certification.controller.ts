import {Body, Controller, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {CertificationService} from './certification.service';
import {CognitiveSearchDto} from '../common/dto/CognitiveSearch.dto';
import {CertificationDto} from './dto/certification.dto';
import {Pagination} from '../common/paginate';
import {Certification} from './certification.entity';

@ApiTags('Certification')
@Controller()
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retriving all certifications'})
  @Get('/tenant/:tenantId/certifications')
  public async getAll(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<CertificationDto[]> {
    return this.certificationService.getAll(tenantId);
  }

  // CHECK
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for certification cognitive search'})
  @Post('/tenant/:tenantId/certification/filter')
  public async certificationsCognitiveSearch(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() {term}: CognitiveSearchDto,
  ): Promise<Pagination<Certification>> {
    return this.certificationService.fetchCertificationsCognitiveSearch(tenantId, term);
  }
}
