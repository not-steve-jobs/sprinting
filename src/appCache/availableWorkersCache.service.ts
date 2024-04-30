import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {AvailableWorkersDto} from 'src/modules/availableWorkers/dto/availableWorkers.dto';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class AvailableWorkersCacheService {
  private readonly name = CacheEntityName.availableWorkers;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getByTenantAndRoleId = (tenantId: number, jobRoleId: string): AvailableWorkersDto | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.availableWorkersRoleIdKey(tenantId, jobRoleId);
    return this.nodeCache.get<AvailableWorkersDto>(key, this.name);
  };

  setByTenantAndRoleId = (tenantId: number, jobRoleId: string, value: AvailableWorkersDto): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.availableWorkersRoleIdKey(tenantId, jobRoleId);
    this.nodeCache.set<AvailableWorkersDto>(key, value, this.name);
  };

  private availableWorkersRoleIdKey = (tenantId: number, roleId: string) =>
    `${this.nodeCache.parseTenantIdKey(tenantId)}_roleId_${roleId}`;
}
