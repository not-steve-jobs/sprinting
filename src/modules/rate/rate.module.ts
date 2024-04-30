import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RateRepository} from './rate.repository';
import {RateService} from './rate.service';
import {RateController} from './rate.controller';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([RateRepository])],
  controllers: [RateController],
  providers: [RateService],
  exports: [RateService],
})
export class RateModule {}
