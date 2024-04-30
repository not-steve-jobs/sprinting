import {QueueSubscription} from './queueSubscription.interface';

/**
 * @template TMessageSettlingMetadata
 * Type of data which is needed to mark a message as processed successfully (complete) or unsuccessfully (errored).
 * This will depend on the implementation and might not be possible in some of them.
 * If this cannot be done, it is strongly recommended to only use the subscribing mechanism.
 */
export interface QueueReceiver<TMessageSettlingMetadata> {
  receiveMessage(queueName: string): Promise<[string, TMessageSettlingMetadata] | undefined>;
  notifyCompleteMessage(queueName: string, messageSettlingMetadata: TMessageSettlingMetadata): Promise<void>;
  notifyErroredMessage(queueName: string, messageSettlingMetadata: TMessageSettlingMetadata): Promise<void>;
  subscribeWorker(queueName: string, worker: (message: string) => Promise<void>): Promise<QueueSubscription>;
}
