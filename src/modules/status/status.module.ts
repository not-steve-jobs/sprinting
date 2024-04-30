import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {StatusRepository} from './status.repository';
import {StatusController} from './status.controller';
import {StatusService} from './status.service';

@Module({
  imports: [TypeOrmModule.forFeature([StatusRepository]), CoreModule],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
