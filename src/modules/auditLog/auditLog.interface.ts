// Keep the changelog of all modified entity attributes
export interface AuditLogChanges {
  [key: string]: AuditLogAttributeChange;
}

// Represent the changes of a specific entity attribute
export interface AuditLogAttributeChange {
  new: number | string;
  old: number | string;
}
