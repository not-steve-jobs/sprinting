import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';
import {SectorListDto} from 'src/modules/sector/dto/sectorList.dto';

@Injectable()
export class SectorCacheService {
  private readonly name = CacheEntityName.sector;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getByTenant = (tenantId: number): SectorListDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdKey(tenantId);
    return this.nodeCache.get<SectorListDto[]>(key, this.name);
  };

  setByTenant = (tenantId: number, values: SectorListDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdKey(tenantId);
    this.nodeCache.set<SectorListDto[]>(key, values, this.name);
  };

  private tenantIdKey = (tenantId: number) => this.nodeCache.parseTenantIdKey(tenantId);
}
