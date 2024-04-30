import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {ConsentRepository} from './consent.repository';
import {ConsentService} from './consent.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConsentRepository]), CoreModule],
  controllers: [],
  providers: [ConsentService],
  exports: [ConsentService],
})
export class ConsentModule {}
