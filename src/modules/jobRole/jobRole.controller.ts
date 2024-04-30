import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {
  Get,
  Param,
  Query,
  Inject,
  forwardRef,
  Controller,
  Injectable,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {AuthScopes} from '../../core/auth/authScopes';
import {Auth} from '../../core/auth/auth.decorator';
import {SharedErrors} from '../../core/error/shared.error';
import {JobRoleService} from './jobRole.service';
import {JobRole} from './jobRole.entity';
import {FeatureConfigurationService} from '../featureConfiguration/featureConfiguration.service';
import {FeatureConfigurationFeature} from '../featureConfiguration/enum/featureConfigurationFeature.enum';
import {JobRoleTemplateService} from '../jobRoleTemplate/jobRoleTemplate.service';
import {ContextService} from 'src/core/context/context.service';
import {JobRolePaginateDto} from './dto/jobRolePaginate.dto';
import {Pagination} from '../common/paginate';

@ApiTags('Job Role')
@Controller()
@Injectable()
export class JobRoleController {
  public constructor(
    private readonly jobRoleService: JobRoleService,
    @Inject(forwardRef(() => JobRoleTemplateService))
    private readonly jobRoleTemplateService: JobRoleTemplateService,
    private readonly contextService: ContextService,
    private readonly featureConfigurationService: FeatureConfigurationService,
  ) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available job roles'})
  @Get('/tenant/:tenantId/job-roles')
  public async getAll(@Param('tenantId', ParseIntPipe) tenantId: number): Promise<JobRole[]> {
    return this.jobRoleService.getAll(tenantId);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available job roles'})
  @Get('/tenant/:tenantId/job-roles/paginated')
  public async getAllPaginated(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Query() paginatorOptions: JobRolePaginateDto,
  ): Promise<Pagination<JobRole>> {
    return this.jobRoleService.getAllPaginated(tenantId, paginatorOptions);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide template for job role'})
  @Get('/tenant/:tenantId/job-role/:jobRoleId/template')
  public async fetchTemplate(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('jobRoleId', ParseUUIDPipe) jobRoleId: string,
  ): Promise<string[]> {
    const {
      config: {source, baseUrl},
    } = await this.featureConfigurationService.getFeatureConfigurationByFeatureName(
      tenantId,
      FeatureConfigurationFeature.JobRoleTemplate,
    );

    if (source === 'storage') {
      return this.jobRoleTemplateService.findOneByJobRoleForUserLanguage(
        tenantId,
        jobRoleId,
        this.contextService.tenantUserContext.tenantUser.userId,
      );
    } else if (source === 'api') {
      return this.jobRoleTemplateService.getJobRoleTemplateForRC(
        baseUrl,
        tenantId,
        this.contextService.userContext.id,
        jobRoleId,
      );
    } else {
      throw new SharedErrors.InternalError({
        message: 'Could not read the source from the database',
      });
    }
  }
}
