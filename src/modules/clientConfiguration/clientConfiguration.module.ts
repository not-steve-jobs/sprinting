import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from 'src/core/core.module';
import {ClientConfigurationRepository} from './clientConfiguration.repository';
import {ClientConfigurationService} from './clientConfiguration.service';
import {ClientConfigurationController} from './clientConfiguration.controller';
import {FeatureConfigurationModule} from '../featureConfiguration/featureConfiguration.module';
import {RoleModule} from '../role/role.module';

@Module({
  imports: [
    CoreModule,
    FeatureConfigurationModule,
    RoleModule,
    TypeOrmModule.forFeature([ClientConfigurationRepository]),
  ],
  providers: [ClientConfigurationService],
  controllers: [ClientConfigurationController],
})
export class ClientConfigurationModule {}
