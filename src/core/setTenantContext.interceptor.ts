import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {ContextService} from './context/context.service';
import {TenantRepository} from '../modules/tenant/tenant.repository';
import {Tenant} from '../modules/tenant/tenant.entity';
import {TenantContext} from './context/tenant.context';

@Injectable()
export class SetTenantContextGuard implements CanActivate {
  constructor(private readonly contextService: ContextService, private readonly tenantRepository: TenantRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [request] = context.getArgs();

    let tenant: Tenant = null;
    const tenantAlias = request.headers['x-tenant-alias'] || request.headers['x-tenantalias'];
    if (tenantAlias) {
      tenant = await this.tenantRepository.findOneByAlias(tenantAlias);
    } else if (request.headers['x-tenantid']) {
      tenant = await this.tenantRepository.findOne(parseInt(request.headers['x-tenantid']));
    }
    // TODO, if there is no tenantId, throw error
    this.contextService.tenantContext = new TenantContext(tenant?.id ?? 99, tenant);

    return true;
  }
}
