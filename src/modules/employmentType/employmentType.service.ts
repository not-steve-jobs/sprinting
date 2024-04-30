import {Injectable} from '@nestjs/common';
import {EmploymentTypeCacheService} from 'src/appCache/employmentTypeCache.service';
import {EmploymentTypeDto} from './dto/employmentType.dto';
import {EmploymentTypeRepository} from './employmentType.repository';

@Injectable()
export class EmploymentTypeService {
  constructor(
    private readonly repository: EmploymentTypeRepository,
    private readonly cache: EmploymentTypeCacheService,
  ) {}

  public async get(tenantId: number): Promise<EmploymentTypeDto[]> {
    let result = this.cache.getByTenant(tenantId);
    if (result) {
      return result;
    }

    result = await this.repository.getTenantEmploymentTypes(tenantId);
    this.cache.setByTenant(tenantId, result);
    return result;
  }
}
