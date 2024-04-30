import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TenantUserInvitationRepository} from './tenantUserInvitation.repository';
import {TenantUserInvitationService} from './tenantUserInvitation.service';
import {TenantUserInvitationController} from './tenantUserInvitation.controller';
import {CoreModule} from 'src/core/core.module';
import {FeatureConfigurationModule} from '../featureConfiguration/featureConfiguration.module';
import {RoleModule} from '../role/role.module';
import {StatusModule} from '../status/status.module';
import {BackgroundNotificationModule} from '../sendBackgroundNotification/backgroundNotification/backgroundNotification.module';
import {TenantRepository} from '../tenant/tenant.repository';
import {TenantUserInvitationBo} from './tenantUserInvitation.bo';
import {TenantUserLocationModule} from '../tenantUserLocation/tenantUserLocation.module';
import {TenantUserPermissionModule} from '../tenantUserPermission/tenantUserPermission.module';
import {InfoSystemModule} from '../integrations/infoSystem/infoSystem.module';
import {DataProvidingModule} from '../integrations/dataProviding/dataProviding.module';
import {UserModule} from '../user/user.module';
import {UserRepository} from '../user/user.repository';
import {UserProfileRepository} from '../userProfile/userProfile.repository';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {SalesForceModule} from '../integrations/salesForce/salesForce.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TenantUserInvitationRepository,
      TenantRepository,
      UserRepository,
      UserProfileRepository,
      TenantUserRepository,
    ]),
    CoreModule,
    FeatureConfigurationModule,
    RoleModule,
    StatusModule,
    BackgroundNotificationModule,
    TenantUserLocationModule,
    TenantUserPermissionModule,
    forwardRef(() => SalesForceModule),
    forwardRef(() => InfoSystemModule),
    forwardRef(() => DataProvidingModule),
    forwardRef(() => UserModule),
  ],
  providers: [TenantUserInvitationService, TenantUserInvitationBo],
  controllers: [TenantUserInvitationController],
  exports: [TenantUserInvitationService, TenantUserInvitationBo],
})
export class TenantUserInvitationModule {}
