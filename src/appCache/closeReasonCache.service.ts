import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {CloseReason} from 'src/modules/closeReason/closeReason.entity';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class CloseReasonCacheService {
  private readonly name = CacheEntityName.closeReason;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getByTenant = (tenantId: number): CloseReason[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allCloseReasonKey(tenantId);
    return this.nodeCache.get<CloseReason[]>(key, this.name);
  };

  setByTenant = (tenantId: number, values: CloseReason[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allCloseReasonKey(tenantId);
    this.nodeCache.set<CloseReason[]>(key, values, this.name);
  };

  getOneById = (tenantId: number, id: number): CloseReason | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.closeReasonIdKey(tenantId, id);
    return this.nodeCache.get<CloseReason>(key, this.name);
  };

  setOneById = (tenantId: number, id: number, value: CloseReason): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.closeReasonIdKey(tenantId, id);
    this.nodeCache.set<CloseReason>(key, value, this.name);
  };

  getAllExternalByTenant = (tenantId: number): CloseReason[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allExternalCloseReasonKey(tenantId);
    return this.nodeCache.get<CloseReason[]>(key, this.name);
  };

  setAllExternalByTenant = (tenantId: number, value: CloseReason[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allExternalCloseReasonKey(tenantId);
    this.nodeCache.set<CloseReason[]>(key, value, this.name);
  };

  getAllInternalByTenant = (tenantId: number): CloseReason[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allInternalCloseReasonKey(tenantId);
    return this.nodeCache.get<CloseReason[]>(key, this.name);
  };

  setAllInternalByTenant = (tenantId: number, value: CloseReason[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allInternalCloseReasonKey(tenantId);
    this.nodeCache.set<CloseReason[]>(key, value, this.name);
  };

  private allCloseReasonKey = (tenantId: number) => this.nodeCache.parseTenantIdKey(tenantId);
  private closeReasonIdKey = (tenantId: number, id: number) => `${this.nodeCache.parseTenantIdKey(tenantId)}_id_${id}`;
  private allExternalCloseReasonKey = (tenantId: number) => `${this.nodeCache.parseTenantIdKey(tenantId)}_allExternal`;
  private allInternalCloseReasonKey = (tenantId: number) => `${this.nodeCache.parseTenantIdKey(tenantId)}_allInternal`;
}
