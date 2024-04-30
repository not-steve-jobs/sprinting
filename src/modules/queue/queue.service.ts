import {Injectable} from '@nestjs/common';
import {BehaviorSubject} from 'rxjs';
import {QueueSubscription} from './queueSubscription.interface';

@Injectable()
export class QueueService {
  private queues: {[key: string]: BehaviorSubject<string[]>};

  constructor() {
    this.queues = {};
  }

  async sendMessage(queueName: string, message: string) {
    if (this.queues[queueName]) this.queues[queueName].next([...this.queues[queueName].getValue(), message]);
    else {
      this.queues[queueName] = new BehaviorSubject([message]);
    }
  }

  async receiveMessage(queueName: string): Promise<string | undefined> {
    if (this.queues[queueName]) {
      const current = this.queues[queueName].getValue();
      this.queues[queueName].next(current.slice(1));
      return current.shift();
    }
    return undefined;
  }

  async subscribeWorker(queueName: string, worker: (message: string) => Promise<void>): Promise<QueueSubscription> {
    if (!this.queues[queueName]) this.queues[queueName] = new BehaviorSubject<string[]>([]);
    const subscription = this.queues[queueName].subscribe(async (messages) => {
      if (messages[0]) {
        try {
          await worker(messages[0]);
        } finally {
          this.queues[queueName].next(messages.slice(1));
        }
      }
    });
    return {
      unsubscribe: async () => subscription.unsubscribe(),
    };
  }
}
