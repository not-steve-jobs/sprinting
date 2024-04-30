import {Module} from '@nestjs/common';
import {CoreModule} from 'src/core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TenantRepository} from './tenant.repository';
import {TenantService} from './tenant.service';
import {CountryModule} from '../country/country.module';

@Module({
  imports: [
    CoreModule, // required for auth decorator
    TypeOrmModule.forFeature([TenantRepository]),
    CountryModule,
  ],
  providers: [TenantService],
  controllers: [],
  exports: [TenantService],
})
export class TenantModule {}
