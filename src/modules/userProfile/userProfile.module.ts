import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {UserProfileController} from './userProfile.controller';
import {UserProfileRepository} from './userProfile.repository';
import {UserProfileService} from './userProfile.service';
import {InfoSystemModule} from '../integrations/infoSystem/infoSystem.module';
import {DataProvidingModule} from '../integrations/dataProviding/dataProviding.module';
import {TenantRepository} from '../tenant/tenant.repository';
import {DepartmentFunctionModule} from '../departmentFunction/departmentFunction.module';
import {UserRepository} from '../user/user.repository';
import {SalesForceModule} from '../integrations/salesForce/salesForce.module';
import {ClientProfileRepository} from '../clientProfile/clientProfile.repository';
import {TenantUserPermissionRepository} from '../tenantUserPermission/tenantUserPermission.repository';
import {TenantUserLocationRepository} from '../tenantUserLocation/tenantUserLocation.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserProfileRepository,
      UserRepository,
      TenantRepository,
      ClientProfileRepository,
      TenantUserPermissionRepository,
      TenantUserLocationRepository,
    ]),
    CoreModule,
    DepartmentFunctionModule,
    forwardRef(() => DataProvidingModule),
    forwardRef(() => InfoSystemModule),
    forwardRef(() => SalesForceModule),
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
