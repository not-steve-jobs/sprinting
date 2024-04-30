import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';
import {ServiceTypeListDto} from 'src/modules/serviceType/dto/serviceTypeList.dto';

@Injectable()
export class ServiceTypeCacheService {
  private readonly name = CacheEntityName.serviceType;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getByTenant = (tenantId: number): ServiceTypeListDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdKey(tenantId);
    return this.nodeCache.get<ServiceTypeListDto[]>(key, this.name);
  };

  setByTenant = (tenantId: number, values: ServiceTypeListDto[]): void => {
    const key = this.tenantIdKey(tenantId);
    if (!this.isEnabled) {
      return;
    }
    this.nodeCache.set<ServiceTypeListDto[]>(key, values, this.name);
  };

  getManyByTenantAndId = (tenantId: number, ids: number[]): ServiceTypeListDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const result = [];
    ids.forEach((id) => {
      const key = this.tenantAndIdKey(tenantId, id);
      const value = this.nodeCache.get<ServiceTypeListDto>(key, this.name);
      if (value) {
        result.push(value);
      }
    });
    return result;
  };

  setManyByTenantAndId = (tenantId: number, values: ServiceTypeListDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    values.forEach((value) => {
      const key = this.tenantAndIdKey(tenantId, value.id);
      this.nodeCache.set<ServiceTypeListDto>(key, value, this.name);
    });
  };

  private tenantIdKey = (tenantId: number) => this.nodeCache.parseTenantIdKey(tenantId);
  private tenantAndIdKey = (tenantId: number, id: number) => `${this.tenantIdKey(tenantId)}_id_${id}`;
}
