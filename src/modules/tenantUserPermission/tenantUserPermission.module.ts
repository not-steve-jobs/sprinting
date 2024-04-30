import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JwtHelper} from '../../helpers/jwt.helper';
import {ContextService} from '../../core/context/context.service';
import {FeatureConfigurationRepository} from '../featureConfiguration/featureConfiguration.repository';
import {CoreModule} from '../../core/core.module';
import {TenantUserPermissionRepository} from './tenantUserPermission.repository';
import {TenantUserPermissionService} from './tenantUserPermission.service';
import {TenantUserPermissionController} from './tenantUserPermission.controller';
import {PermissionModule} from '../permission/permission.module';
import {UserProfileModule} from '../userProfile/userProfile.module';
import {UserModule} from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TenantUserPermissionRepository, FeatureConfigurationRepository]),
    CoreModule,
    PermissionModule,
    UserProfileModule,
    forwardRef(() => UserModule),
  ],
  controllers: [TenantUserPermissionController],
  providers: [TenantUserPermissionService, JwtHelper, ContextService],
  exports: [TenantUserPermissionService],
})
export class TenantUserPermissionModule {}
