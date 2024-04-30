import {Injectable} from '@nestjs/common';
import {CertificationDto} from './dto/certification.dto';
import {CertificationRepository} from './certification.repository';
import {Pagination} from '../common/paginate';
import {AzureCognitiveSearchIndex} from '../azureCognitiveSearch/azureCognitiveSearchIndex.enum';
import {CertificationErrors} from './certification.error';
import {Certification} from './certification.entity';
import {AzureCognitiveSearchService} from '../azureCognitiveSearch/azureCognitiveSearch.service';
import {CertificationCacheService} from 'src/appCache/certificationCache.service';

@Injectable()
export class CertificationService {
  constructor(
    private readonly repository: CertificationRepository,
    private readonly azureCognitiveSearchService: AzureCognitiveSearchService,
    private readonly cache: CertificationCacheService,
  ) {}

  public async getAll(tenantId: number): Promise<CertificationDto[]> {
    let result = this.cache.getByTenant(tenantId);
    if (result) {
      return result;
    }

    result = await this.repository.getTenantCertifications(tenantId);
    this.cache.setByTenant(tenantId, result);
    return result;
  }

  public async findOneBySkillCode(tenantId: number, skillCode: string): Promise<Certification> {
    let result = this.cache.getOneBySkillcode(tenantId, skillCode);
    if (result) {
      return result;
    }

    result = await this.repository.findOneBySkillCode(skillCode, tenantId);
    this.cache.setOneBySkillcode(tenantId, skillCode, result);
    return result;
  }

  async fetchCertificationsCognitiveSearch(tenantId: number, term: string): Promise<Pagination<Certification>> {
    try {
      return this.azureCognitiveSearchService.fuzzyQuery(
        this.azureCognitiveSearchService.getIndexNameForTenant(AzureCognitiveSearchIndex.CERTIFICATIONS, tenantId),
        `/.*${term}.*/`,
        {
          orderby: 'name desc',
        },
      );
    } catch (error) {
      throw new CertificationErrors.CertificationErrorFetchError(null, error);
    }
  }
}
