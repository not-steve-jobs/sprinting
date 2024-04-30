import {Module} from '@nestjs/common';
import {FeatureConfigurationController} from './featureConfiguration.controller';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FeatureConfigurationRepository} from './featureConfiguration.repository';
import {FeatureConfigurationService} from './featureConfiguration.service';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([FeatureConfigurationRepository])],
  providers: [FeatureConfigurationService],
  controllers: [FeatureConfigurationController],
  exports: [FeatureConfigurationService],
})
export class FeatureConfigurationModule {}
