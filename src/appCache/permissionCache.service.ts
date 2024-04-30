import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';
import {PermissionListDto} from 'src/modules/permission/dto/permissionList.dto';

@Injectable()
export class PermissionCacheService {
  private readonly name = CacheEntityName.permission;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getManyByTenantAndName = (tenantId: number, names: string[]): PermissionListDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const result = [];
    names.forEach((name) => {
      const key = this.tenantAndNameKey(tenantId, name);
      const value = this.nodeCache.get<PermissionListDto>(key, this.name);
      if (value) {
        result.push(value);
      }
    });
    return result;
  };

  setManyByTenantAndName = (tenantId: number, values: PermissionListDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    values.forEach((value) => {
      const key = this.tenantAndNameKey(tenantId, value.name);
      this.nodeCache.set<PermissionListDto>(key, value, this.name);
    });
  };

  private tenantAndNameKey = (tenantId: number, name: string) =>
    `${this.nodeCache.parseTenantIdKey(tenantId)}_name_${name}`;
}
