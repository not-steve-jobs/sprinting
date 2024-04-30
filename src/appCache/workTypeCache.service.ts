import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';
import {WorkType} from 'src/modules/workType/workType.entity';

@Injectable()
export class WorkTypeCacheService {
  private readonly name = CacheEntityName.workType;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getByTenant = (tenantId: number): WorkType[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdKey(tenantId);
    return this.nodeCache.get<WorkType[]>(key, this.name);
  };

  setByTenant = (tenantId: number, values: WorkType[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdKey(tenantId);
    this.nodeCache.set<WorkType[]>(key, values, this.name);
  };

  private tenantIdKey = (tenantId: number) => this.nodeCache.parseTenantIdKey(tenantId);
}
