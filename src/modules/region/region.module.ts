import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RegionRepository} from './region.repository';
import {RegionService} from './region.service';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([RegionRepository])],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
