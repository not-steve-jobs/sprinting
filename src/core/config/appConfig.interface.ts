import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';

export interface AzureConfig {
  blobConnection: string;
}

export interface NodeCacheConfig {
  isEnabled: boolean;
  cachedEntity: {[key in CacheEntityName]: boolean};
}
