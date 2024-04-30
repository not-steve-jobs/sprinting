import {Injectable} from '@nestjs/common';
import {QueueService} from './queue.service';
import {QueueReceiver} from './queueReceiver.interface';

@Injectable()
export class QueueReceiverService implements QueueReceiver<null> {
  constructor(private queueService: QueueService) {}

  async receiveMessage(queueName: string): Promise<[string, null] | undefined> {
    const message = await this.queueService.receiveMessage(queueName);
    return message ? [message, null] : undefined;
  }

  async subscribeWorker(queueName: string, worker: (message: string) => Promise<void>) {
    return this.queueService.subscribeWorker(queueName, worker);
  }

  async notifyCompleteMessage() {
    return; // does nothing for this implementation
  }

  async notifyErroredMessage() {
    return; // does nothing for this implementation
  }
}
