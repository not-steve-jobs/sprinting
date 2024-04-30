export interface QueueSender {
  sendMessage(queueName: string, message: string): Promise<void>;
}
