import {WorkType} from './workType.entity';
import {Injectable} from '@nestjs/common';
import {WorkTypeRepository} from './workType.repository';
import {WorkTypeCacheService} from 'src/appCache/workTypeCache.service';

@Injectable()
export class WorkTypeService {
  constructor(private readonly workTypeRepository: WorkTypeRepository, private readonly cache: WorkTypeCacheService) {}

  public async getAll(tenantId: number): Promise<WorkType[]> {
    let result = this.cache.getByTenant(tenantId);
    if (result) {
      return result;
    }

    result = await this.workTypeRepository.getAll(tenantId);
    this.cache.setByTenant(tenantId, result);
    return result;
  }
}
