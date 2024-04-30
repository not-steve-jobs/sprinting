import {Injectable} from '@nestjs/common';
import NodeCache from 'node-cache';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {CacheEntityName} from './nodeCache.enum';

@Injectable()
export class NodeCacheService {
  private nodeCache: {[key: string]: NodeCache} = {};
  constructor(private readonly appConfig: AppConfigService) {}

  isEnabled = () => this.appConfig.nodeCache.isEnabled;

  get = <T>(key: string, cache: CacheEntityName): T => {
    return this.getCache(cache).get<T>(key);
  };

  set = <T>(key: string, value: T, cache: CacheEntityName) => {
    this.getCache(cache).set(key, value);
  };

  getCache = (cache: CacheEntityName) => {
    if (this.nodeCache[cache] == undefined) {
      this.nodeCache[cache] = new NodeCache();
    }
    return this.nodeCache[cache];
  };

  parseTenantIdKey = (tenantId: number) => {
    return `tid${tenantId}`;
  };
  parseKey = (tenantId: number, entityIdKey: string) => {
    return `${this.parseTenantIdKey(tenantId)}_${entityIdKey}`;
  };
}
