import {Module} from '@nestjs/common';
import {CoreModule} from 'src/core/core.module';
import {EmailQueuedService} from './emailQueued.service';
import {QueueModule} from '../../queue/queue.module';

@Module({
  imports: [QueueModule, CoreModule],
  providers: [EmailQueuedService],
  controllers: [],
  exports: [EmailQueuedService],
})
export class EmailQueuedModule {}
