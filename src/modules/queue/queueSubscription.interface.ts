export interface QueueSubscription {
  /**
   * Stops this subscription from listening to the queue.
   */
  unsubscribe: () => Promise<void>;
}
