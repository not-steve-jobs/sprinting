export interface DataProvidingEvent<T = Record<string, any>> {
  eventName: string;
  eventId: string;
  country: string;
  brand: string;
  originSystem: string;
  candidateId: string;
  parameters: T;
}
