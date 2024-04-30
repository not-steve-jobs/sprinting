import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RegionPostalCodeRepository} from './regionPostalCode.repository';
import {RegionPostalCodeService} from './regionPostalCode.service';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([RegionPostalCodeRepository])],
  providers: [RegionPostalCodeService],
  exports: [RegionPostalCodeService],
})
export class RegionPostalCodeModule {}
