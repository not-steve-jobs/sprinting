import {Module} from '@nestjs/common';
import {QueueService} from './queue.service';
import {QueueReceiverService} from './queueReceiver.service';
import {QueueSenderService} from './queueSender.service';

const QueueSenderName = 'QUEUE_SENDER';
const QueueReceiverName = 'QUEUE_RECEIVER';

const queueSenderProvider = {
  provide: QueueSenderName,
  useClass: QueueSenderService,
};

const queueReceiverProvider = {
  provide: QueueReceiverName,
  useClass: QueueReceiverService,
};

@Module({
  imports: [],
  providers: [QueueService, queueSenderProvider, queueReceiverProvider],
  controllers: [],
  exports: [queueSenderProvider, queueReceiverProvider],
})
export class QueueModule {}

export {QueueSenderName, QueueReceiverName};
