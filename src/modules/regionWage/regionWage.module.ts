import {forwardRef, Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RegionWageRepository} from './regionWage.repository';
import {RegionWageService} from './regionWage.service';
import {RegionWageController} from './regionWage.controller';
import {LocationModule} from '../location/location.module';
import {RegionModule} from '../region/region.module';
import {RegionPostalCodeModule} from '../regionPostalCode/regionPostalCode.module';
import {LevelModule} from '../level/level.module';
import {RegionRepository} from '../region/region.repository';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([RegionWageRepository, RegionRepository]),
    forwardRef(() => LocationModule),
    forwardRef(() => RegionModule),
    forwardRef(() => RegionPostalCodeModule),
    forwardRef(() => LevelModule),
  ],
  controllers: [RegionWageController],
  providers: [RegionWageService],
})
export class RegionWageModule {}
