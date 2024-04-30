import {Injectable} from '@nestjs/common';
import {Tenant} from 'src/modules/tenant/tenant.entity';

/**
 * Service providing an interface to manage the tenant cache.
 */
@Injectable()
export class TenantCacheService {
  /**
   * In-memory map of the tenants by ID
   */
  private memoIds = new Map<number, Tenant>();

  /**
   * In-memory map of the tenants by Alias
   */
  private memoAlias = new Map<string, Tenant>();

  /**
   * Get a tenant by ID if it is stored in the cache.
   * @param tenantId ID (number) of the tenant
   * @returns the Tenant if found in the cache; `null` if not.
   */
  public get(tenantId: number): Tenant | null {
    return this.memoIds.get(tenantId) ?? null;
  }

  /**
   * Get a tenant by Alias if it is stored in the cache.
   * @param tenantAlias Alias of the tenant
   * @returns the Tenant if found in the cache; `null` if not.
   */
  public getByAlias(tenantAlias: string): Tenant | null {
    return this.memoAlias.get(tenantAlias) ?? null;
  }

  /**
   * Set a tenant in the cache, using the ID as key.
   * @param tenantId ID (number) of the tenant
   */
  public set(tenantId: number, tenant: Tenant): void {
    this.memoIds.set(tenantId, tenant);
  }

  /**
   * Set a tenant in the cache, using the Alias as key.
   * @param tenantId Alias of the tenant
   */
  public setByAlias(tenantAlias: string, tenant: Tenant): void {
    this.memoAlias.set(tenantAlias, tenant);
  }
}
