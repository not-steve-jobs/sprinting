import {TenantUser} from '../../modules/tenantUser/tenantUser.entity';

export class TenantUserContext {
  constructor(public tenantUser: TenantUser) {}
}
