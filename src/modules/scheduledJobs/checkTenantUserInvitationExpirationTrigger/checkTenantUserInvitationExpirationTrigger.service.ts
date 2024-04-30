import {Injectable} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {LockType, runWithAdvisoryLock} from 'src/helpers/concurrency.helper';
import {TenantService} from '../../tenant/tenant.service';
import {TenantUserInvitationBo} from '../../tenantUserInvitation/tenantUserInvitation.bo';

@Injectable()
export class CheckTenantUserInvitationExpirationTriggerService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly tenantUserInvitationBto: TenantUserInvitationBo,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async processData() {
    await runWithAdvisoryLock(LockType.UserInvitationExpired, async () => {
      const tenants = await this.tenantService.getAll();
      await Promise.all(tenants.map((tenant) => this.tenantUserInvitationBto.checkExpiration(tenant.id)));
    });
  }
}
