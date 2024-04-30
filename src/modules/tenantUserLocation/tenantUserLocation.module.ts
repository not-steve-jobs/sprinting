import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {TenantUserLocationRepository} from './tenantUserLocation.repository';
import {TenantUserLocationService} from './tenantUserLocation.service';

@Module({
  imports: [TypeOrmModule.forFeature([TenantUserLocationRepository]), CoreModule],
  controllers: [],
  providers: [TenantUserLocationService],
  exports: [TenantUserLocationService],
})
export class TenantUserLocationModule {}
