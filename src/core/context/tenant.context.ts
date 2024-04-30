import {Tenant} from '../../modules/tenant/tenant.entity';

export class TenantContext {
  constructor(public tenantId: number, public tenant: Tenant) {}
}
