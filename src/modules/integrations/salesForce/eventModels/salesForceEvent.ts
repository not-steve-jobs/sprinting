export interface SalesForceEvent<T = Record<string, any>> {
  eventName: string;
  eventId: string;
  country: string;
  brand?: string;
  keyValues?;
  parameters: T;
}
