import {forwardRef, Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UserConsentModule} from '../userConsent/userConsent.module';
import {TenantUserInvitationModule} from '../tenantUserInvitation/tenantUserInvitation.module';
import {StatusModule} from '../status/status.module';
import {InfoSystemModule} from '../integrations/infoSystem/infoSystem.module';
import {TenantUserLocationModule} from '../tenantUserLocation/tenantUserLocation.module';
import {TenantUserPermissionModule} from '../tenantUserPermission/tenantUserPermission.module';
import {TenantModule} from '../tenant/tenant.module';
import {UserRepository} from '../user/user.repository';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {TenantRepository} from '../tenant/tenant.repository';

@Module({
  imports: [
    CoreModule,
    UserConsentModule,
    TypeOrmModule.forFeature([UserRepository, TenantUserRepository, TenantRepository]),
    TenantUserInvitationModule,
    StatusModule,
    forwardRef(() => InfoSystemModule),
    TenantUserLocationModule,
    TenantUserPermissionModule,
    TenantModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
