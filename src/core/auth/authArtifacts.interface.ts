export interface AuthArtifacts {
  authType: 'clabackend' | 'azureIdp';
  userEmail: string;
  userId: string;
  tenantId: number;
  B2CId: string;
}
