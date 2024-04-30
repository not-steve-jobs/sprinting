import {ServiceTypeListDto} from './dto/serviceTypeList.dto';
import {Injectable} from '@nestjs/common';
import {ServiceTypeRepository} from './serviceType.repository';
import {ServiceTypeCacheService} from 'src/appCache/serviceTypeCache.service';

@Injectable()
export class ServiceTypeService {
  constructor(
    private readonly serviceTypeRepository: ServiceTypeRepository,
    private readonly cache: ServiceTypeCacheService,
  ) {}

  public async getAll(tenantId: number): Promise<ServiceTypeListDto[]> {
    let result = this.cache.getByTenant(tenantId);
    if (result) {
      return result;
    }

    result = await this.serviceTypeRepository.getAll(tenantId);
    this.cache.setByTenant(tenantId, result);
    return result;
  }

  public async getStatusesById(tenantId: number, id: number[]): Promise<ServiceTypeListDto[]> {
    let result = this.cache.getManyByTenantAndId(tenantId, id);
    if (result) {
      return result;
    }

    result = await this.serviceTypeRepository.findById(tenantId, id);
    this.cache.setManyByTenantAndId(tenantId, result);
    return result;
  }
}
