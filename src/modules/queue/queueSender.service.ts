import {Injectable} from '@nestjs/common';
import {QueueSender} from './queueSender.interface';
import {QueueService} from './queue.service';

@Injectable()
export class QueueSenderService implements QueueSender {
  constructor(private queueService: QueueService) {}

  async sendMessage(queueName: string, message: string) {
    return this.queueService.sendMessage(queueName, message);
  }
}
