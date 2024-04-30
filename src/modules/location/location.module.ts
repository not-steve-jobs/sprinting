import {forwardRef, Module} from '@nestjs/common';
import {LocationController} from './location.controller';
import {LocationService} from './location.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LocationRepository} from './location.repository';
import {CoreModule} from '../../core/core.module';
import {AzureCognitiveSearchModule} from '../azureCognitiveSearch/azureCognitiveSearch.module';
import {DataProvidingModule} from '../integrations/dataProviding/dataProviding.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationRepository]),
    CoreModule,
    AzureCognitiveSearchModule,
    forwardRef(() => DataProvidingModule),
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
