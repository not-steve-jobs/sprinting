import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';
import {Type} from 'src/modules/type/type.entity';

@Injectable()
export class TypeCacheService {
  private readonly name = CacheEntityName.type;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getByTenant = (tenantId: number): Type[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdKey(tenantId);
    return this.nodeCache.get<Type[]>(key, this.name);
  };

  setByTenant = (tenantId: number, values: Type[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdKey(tenantId);
    this.nodeCache.set<Type[]>(key, values, this.name);
  };

  private tenantIdKey = (tenantId: number) => this.nodeCache.parseTenantIdKey(tenantId);
}
