import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../../core/core.module';
import {DataProvidingEventsService} from './dataProvidingEvents.service';
import {TenantRepository} from 'src/modules/tenant/tenant.repository';
import {LocationRepository} from 'src/modules/location/location.repository';
import {ClientRepository} from 'src/modules/client/client.repository';
import {UserRepository} from 'src/modules/user/user.repository';
import {CountryRepository} from 'src/modules/country/country.repository';
import {BusMessageModule} from 'src/modules/busMessage/busMessage.module';
import {IntegrationLogs} from '../integrationLogging.service';
import {CommonIntegrationService} from '../commonIntegration.service';
import {RoleModule} from 'src/modules/role/role.module';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([
      TenantRepository,
      LocationRepository,
      ClientRepository,
      UserRepository,
      CountryRepository,
    ]),
    BusMessageModule,
    RoleModule,
  ],
  providers: [DataProvidingEventsService, CommonIntegrationService, IntegrationLogs],
  controllers: [],
  exports: [DataProvidingEventsService],
})
export class DataProvidingModule {}
