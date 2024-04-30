import {Injectable} from '@nestjs/common';
import {RedisExpirationTime} from 'src/modules/redis/redis.enum';
import {RedisService} from 'src/modules/redis/redis.service';
import {RedisKey} from 'src/modules/redis/redisKey';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';

/**
 * Service providing an interface to manage the TenantUser cache.
 */
@Injectable()
export class TenantUserCacheService {
  constructor(private redis: RedisService) {}

  /**
   * Retrieves a TenantUser from the Redis store, if it exists.
   *
   * @param tenantId Numeric Id of the tenant
   * @param B2CId Id of the user in Azure AD B2C
   * @returns (in Promise) `TenantUser` if found; `null` if not
   */
  public async get(tenantId: number, B2CId: string): Promise<TenantUser | null> {
    return await this.redis.getAsyncAs<TenantUser>(RedisKey.tenantUser(tenantId, B2CId));
  }

  /**
   * Stores a TenantUser in the Redis cache.
   *
   * @param tenantUser TenantUser data
   * @param ttl Expiration time in seconds.
   * @returns true if succeeded, false if errored.
   */
  public async set(tenantUser: TenantUser, ttl: number = RedisExpirationTime.OneMinute): Promise<boolean> {
    return await this.redis.setAsync(
      RedisKey.tenantUser(tenantUser.tenantId, tenantUser.user.B2CId),
      JSON.stringify(tenantUser),
      ttl,
    );
  }

  /**
   * Invalidates (deletes) a TenantUser entry from the Redis cache.
   *
   * @param tenantId Numeric Id of the tenant
   * @param B2CIdId of the user in Azure AD B2C
   */
  public async invalidate(tenantId: number, B2CId: string): Promise<void> {
    return await this.redis.delAsync(RedisKey.tenantUser(tenantId, B2CId));
  }
}
