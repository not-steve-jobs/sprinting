export interface InfoSystemErrorResponse<T = Record<string, any>> {
  commandName: string;
  commandId: string;
  country: string;
  brand: string;
  commandOriginSystem?: string;
  objectId?: string;
  objectType?: string;
  errorOriginSystem: string;
  parameters: T;
}
