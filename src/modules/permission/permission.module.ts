import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JwtHelper} from '../../helpers/jwt.helper';
import {ContextService} from '../../core/context/context.service';
import {FeatureConfigurationRepository} from '../featureConfiguration/featureConfiguration.repository';
import {CoreModule} from '../../core/core.module';
import {PermissionRepository} from './permission.repository';
import {PermissionController} from './permission.controller';
import {PermissionService} from './permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionRepository, FeatureConfigurationRepository]), CoreModule],
  controllers: [PermissionController],
  providers: [PermissionService, JwtHelper, ContextService],
  exports: [PermissionService],
})
export class PermissionModule {}
