import {Injectable} from '@nestjs/common';
import {JobRoleRepository} from './jobRole.repository';
import {JobRole} from './jobRole.entity';
import {Pagination} from '../common/paginate';
import {UserProfile} from '../userProfile/userProfile.entity';
import {AzureCognitiveSearchIndex} from '../azureCognitiveSearch/azureCognitiveSearchIndex.enum';
import {UserProfileError} from '../userProfile/userProfile.error';
import {DocumentAction} from '../azureCognitiveSearch/documentAction.enum';
import {AzureCognitiveSearchService} from '../azureCognitiveSearch/azureCognitiveSearch.service';
import {JobRoleFilterDto} from './dto/jobRoleFilter.dto';
import {getConnection} from 'typeorm';
import {JobOrderRepository} from '../jobOrder/jobOrder.repository';
import {JobOrderAssociateRepository} from '../jobOrderAssociate/jobOrderAssociate.repository';
import {JobOrderAssociateCaseRepository} from '../jobOrderAssociateCase/jobOrderAssociateCase.repository';
import {JobOrderLanguageRepository} from '../jobOrderLanguage/jobOrderLanguage.repository';
import {JobOrderCertificationRepository} from '../jobOrderCertification/jobOrderCertification.repository';
import {AvailableWorkersRepository} from '../availableWorkers/availableWorkers.repository';
import {JobRoleTemplateRepository} from '../jobRoleTemplate/jobRoleTemplate.repository';
import {RegionWageRepository} from '../regionWage/regionWage.repository';
import {JobRolePaginateDto} from './dto/jobRolePaginate.dto';
import {JobRoleCacheService} from 'src/appCache/jobRoleCache.service';

@Injectable()
export class JobRoleService {
  constructor(
    private readonly jobRoleRepository: JobRoleRepository,
    private readonly azureCognitiveSearchService: AzureCognitiveSearchService,
    private readonly cache: JobRoleCacheService,
  ) {}

  public async getAll(tenantId: number): Promise<JobRole[]> {
    let result = this.cache.getByTenant(tenantId);
    if (result) {
      return result;
    }

    result = await this.jobRoleRepository.findAll(tenantId);
    this.cache.setByTenant(tenantId, result);
    return result;
  }

  public async getAllPaginated(tenantId: number, paginatorOptions: JobRolePaginateDto): Promise<Pagination<JobRole>> {
    return this.jobRoleRepository.findAllPaginated(tenantId, paginatorOptions);
  }

  public async findOneBySkillCode(tenantId: number, skillCode: string): Promise<JobRole> {
    let result = this.cache.getOneByTenantAndSkillCode(tenantId, skillCode);
    if (result) {
      return result;
    }

    result = await this.jobRoleRepository.findOneBySkillCode(tenantId, skillCode);
    this.cache.setByTenantAndSkillCodeKey(tenantId, skillCode, result);
    return result;
  }

  public async findOneByRoleId(tenantId: number, jobRoleId: string): Promise<JobRole> {
    let result = this.cache.getOneByTenantAndRoleId(tenantId, jobRoleId);
    if (result) {
      return result;
    }

    result = await this.jobRoleRepository.findOne(tenantId, jobRoleId);
    this.cache.setByTenantAndRoleIdKey(tenantId, jobRoleId, result);
    return result;
  }

  async fetchJobRolesCognitiveSearch(tenantId: number, term: string): Promise<Pagination<UserProfile>> {
    try {
      return this.azureCognitiveSearchService.fuzzyQuery(
        this.azureCognitiveSearchService.getIndexNameForTenant(AzureCognitiveSearchIndex.JOBROLES, tenantId),
        `/.*${term}.*/`,
        {
          orderby: 'name desc',
        },
      );
    } catch (error) {
      throw new UserProfileError.UserProfileFetchError(null, error);
    }
  }

  public async deleteRoles(tenantId: number, jobRoleIds: string[]): Promise<any> {
    return await getConnection().transaction(async (tManager) => {
      const jobOrderRepo = tManager.getCustomRepository(JobOrderRepository);
      const jobRoleRepo = tManager.getCustomRepository(JobRoleRepository);
      const jobOrderAssociateRepo = tManager.getCustomRepository(JobOrderAssociateRepository);
      const jobOrderAssociateCaseRepo = tManager.getCustomRepository(JobOrderAssociateCaseRepository);
      const jobOrderLanguageRepo = tManager.getCustomRepository(JobOrderLanguageRepository);
      const jobOrderCertificationRepo = tManager.getCustomRepository(JobOrderCertificationRepository);
      const availableWorkersRepo = tManager.getCustomRepository(AvailableWorkersRepository);
      const jobRoleTemplateRepo = tManager.getCustomRepository(JobRoleTemplateRepository);
      const regionWageRepo = tManager.getCustomRepository(RegionWageRepository);
      const jobOrderIdsByRoles = (await jobOrderRepo.findJobOrdersByRolesAndTenant(tenantId, jobRoleIds)).map(
        (jobOrder) => jobOrder.id,
      );

      await jobOrderAssociateCaseRepo.deleteCasesForJobOrders(tenantId, jobOrderIdsByRoles);
      await jobOrderAssociateRepo.deleteAllJobOrdersAssociates(tenantId, jobOrderIdsByRoles);
      await jobOrderLanguageRepo.deleteAllJobOrderLanguages(tenantId, jobOrderIdsByRoles);
      await jobOrderCertificationRepo.deleteAllJobOrdersCertifications(tenantId, jobOrderIdsByRoles);
      await jobOrderRepo.deleteJobOrders(tenantId, jobOrderIdsByRoles);
      await availableWorkersRepo.deleteWorkersForRoles(tenantId, jobRoleIds);
      await jobRoleTemplateRepo.deleteTemplatesForRoles(tenantId, jobRoleIds);
      await regionWageRepo.deleteWageForRoles(tenantId, jobRoleIds);
      await jobRoleRepo.deleteRoles(tenantId, jobRoleIds);
      return;
    });
  }

  async upsertAzureCognitiveSearchData(jobRole: JobRole, tenantId: number) {
    await this.azureCognitiveSearchService.createIndexIfNotExists(AzureCognitiveSearchIndex.JOBROLES, tenantId);

    const dataForAzure = new JobRoleFilterDto(jobRole);

    await this.azureCognitiveSearchService.postData(
      this.azureCognitiveSearchService.getIndexNameForTenant(AzureCognitiveSearchIndex.JOBROLES, tenantId),
      DocumentAction.MERGE_OR_UPLOAD,
      [dataForAzure],
    );
  }
}
