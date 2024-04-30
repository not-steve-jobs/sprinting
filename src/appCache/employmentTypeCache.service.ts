import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {EmploymentTypeDto} from 'src/modules/employmentType/dto/employmentType.dto';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class EmploymentTypeCacheService {
  private readonly name = CacheEntityName.employmentType;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getByTenant = (tenantId: number): EmploymentTypeDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdKey(tenantId);
    return this.nodeCache.get<EmploymentTypeDto[]>(key, this.name);
  };

  setByTenant = (tenantId: number, values: EmploymentTypeDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdKey(tenantId);
    this.nodeCache.set<EmploymentTypeDto[]>(key, values, this.name);
  };

  private tenantIdKey = (tenantId: number) => this.nodeCache.parseTenantIdKey(tenantId);
}
