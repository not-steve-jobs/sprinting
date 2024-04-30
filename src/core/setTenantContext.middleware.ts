import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import {ContextService} from './context/context.service';
import {TenantRepository} from '../modules/tenant/tenant.repository';
import {Tenant} from '../modules/tenant/tenant.entity';
import {TenantContext} from './context/tenant.context';
import {TenantCacheService} from 'src/appCache/tenantCache.service';

@Injectable()
export class SetTenantContextMiddleware implements NestMiddleware<Request, Response> {
  constructor(
    private readonly contextService: ContextService,
    private readonly tenantRepository: TenantRepository,
    private readonly tenantCache: TenantCacheService,
  ) {}

  async use(request: Request, res: Response, next: () => void) {
    await this.setTenant(request);
    next();
  }

  async setTenant(request: Request): Promise<void> {
    let tenant: Tenant = null;
    const tenantAlias = (request.headers['x-tenant-alias'] ?? request.headers['x-tenantalias']) as string;
    if (tenantAlias) {
      tenant = this.tenantCache.getByAlias(tenantAlias);
      if (!tenant) {
        tenant = await this.tenantRepository.findOneByAliasWithRelations(tenantAlias);
        this.tenantCache.setByAlias(tenantAlias, tenant);
      }
    } else if (request.headers['x-tenantid']) {
      const tenantId = parseInt(request.headers['x-tenantid'] as string);
      tenant = this.tenantCache.get(tenantId);
      if (!tenant) {
        tenant = await this.tenantRepository.findOneWithRelations(tenantId);
        this.tenantCache.set(tenantId, tenant);
      }
    }

    this.contextService.tenantContext = new TenantContext(tenant?.id, tenant);
  }
}
