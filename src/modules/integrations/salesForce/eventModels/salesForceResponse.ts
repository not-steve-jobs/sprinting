export interface SalesForceResponse {
  Success: boolean;
  CommandName: string;
  CommandId: string;
  Data: string;
  externalContactId?: string;
}
