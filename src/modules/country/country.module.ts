import {CountryService} from './country.service';
import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CountryRepository} from './country.repository';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([CountryRepository])],
  providers: [CountryService],
  controllers: [],
  exports: [CountryService],
})
export class CountryModule {}
