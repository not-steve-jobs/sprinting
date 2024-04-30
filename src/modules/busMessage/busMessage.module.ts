import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {BusMessageRepository} from './busMessage.repository';
import {BusMessageService} from './busMessage.service';
import {BusMessageAttemptsRepository} from './busMessageAttempts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BusMessageRepository, BusMessageAttemptsRepository]), CoreModule],
  controllers: [],
  providers: [BusMessageService],
  exports: [BusMessageService],
})
export class BusMessageModule {}
