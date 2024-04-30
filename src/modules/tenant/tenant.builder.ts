import {EntityBuilder} from '../../lib/builder.base';
import {Tenant} from './tenant.entity';
import {tenantData} from '../../seed/tenantSpecific/data/tenant.data';

export class TenantBuilder extends EntityBuilder<Tenant> {
  static tenantGenericBuilder = () => {
    return new TenantBuilder().set(tenantData.find((t) => t.id === 99));
  };

  static tenantAdeccoCABuilder = () => {
    return new TenantBuilder().set(tenantData.find((t) => t.id === 100));
  };

  public build(): Tenant {
    return new Tenant(this.data);
  }
}
