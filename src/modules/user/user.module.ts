import {forwardRef, Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserRepository} from './user.repository';
import {CoreModule} from '../../core/core.module';
import {TenantUserInvitationModule} from '../tenantUserInvitation/tenantUserInvitation.module';
import {RoleModule} from '../role/role.module';
import {StatusModule} from '../status/status.module';
import {UserProfileModule} from '../userProfile/userProfile.module';
import {UserProfileRepository} from '../userProfile/userProfile.repository';
import {TenantUserLocationModule} from '../tenantUserLocation/tenantUserLocation.module';
import {TenantUserPermissionModule} from '../tenantUserPermission/tenantUserPermission.module';
import {AzureStorageHelper} from '../../helpers/azure.storage.helper';
import {AzureCognitiveSearchModule} from '../azureCognitiveSearch/azureCognitiveSearch.module';
import {InfoSystemModule} from './../integrations/infoSystem/infoSystem.module';
import {DataProvidingModule} from '../integrations/dataProviding/dataProviding.module';
import {DepartmentFunctionModule} from '../departmentFunction/departmentFunction.module';
import {ConsentModule} from '../consent/consent.module';
import {BackgroundNotificationModule} from '../sendBackgroundNotification/backgroundNotification/backgroundNotification.module';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {DisableReasonModule} from '../disableReason/disableReason.module';
import {PermissionModule} from '../permission/permission.module';
import {TenantRepository} from '../tenant/tenant.repository';
import {SalesForceModule} from '../integrations/salesForce/salesForce.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, TenantUserRepository, UserProfileRepository, TenantRepository]),
    CoreModule,
    forwardRef(() => InfoSystemModule),
    forwardRef(() => SalesForceModule),
    forwardRef(() => DataProvidingModule),
    RoleModule,
    TenantUserInvitationModule,
    StatusModule,
    forwardRef(() => UserProfileModule),
    TenantUserLocationModule,
    TenantUserPermissionModule,
    DepartmentFunctionModule,
    AzureCognitiveSearchModule,
    ConsentModule,
    BackgroundNotificationModule,
    DisableReasonModule,
    PermissionModule,
  ],
  controllers: [UserController],
  providers: [UserService, AzureStorageHelper],
  exports: [UserService],
})
export class UserModule {}
