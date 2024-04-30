import {Module} from '@nestjs/common';
import {CheckTenantUserInvitationExpirationTriggerService} from './checkTenantUserInvitationExpirationTrigger.service';
import {CoreModule} from '../../../core/core.module';
import {TenantUserInvitationModule} from '../../tenantUserInvitation/tenantUserInvitation.module';
import {TenantModule} from '../../tenant/tenant.module';

@Module({
  imports: [CoreModule, TenantUserInvitationModule, TenantModule],
  providers: [CheckTenantUserInvitationExpirationTriggerService],
  controllers: [],
  exports: [],
})
export class checkTenantUserInvitationExpirationTriggerModule {}
