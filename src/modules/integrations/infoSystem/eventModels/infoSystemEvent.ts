export interface InfoSystemEvent<T = Record<string, any>> {
  eventName: string;
  eventId: string;
  country: string;
  brand?: string;
  parameters: T;
  keyValues?;
}
export interface GipEventWithExtendedProps extends InfoSystemEvent {
  receivedAt?: Date;
}
