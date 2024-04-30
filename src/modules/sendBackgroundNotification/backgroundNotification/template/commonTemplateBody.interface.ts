export interface CommonApplicationDetails {
  ProductId: string;
  Type: string;
  Channel: string;
  Media: string;
}
export interface CommonTenantDetails extends CommonApplicationDetails {
  TenantId: string;
  Country: string;
  Language: string;
  Brand: string;
}
export interface CommonTemplateBody extends CommonTenantDetails {
  EventType: string;
  Service_or_Campaign: string;
  ButtonURL?: string;
}
