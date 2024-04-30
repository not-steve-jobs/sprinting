// Describe the list with all available actions which can be logged
// NOTE: Still not sure whether we should duplicate the JobOrder.* here, because we already know the entityName
// For now I'll keep it so it can be easier to read it and also to have some separation of the logged entires
// but maybe at some point we can remove this part and leave the types only as 'Created, Updated', etc.
export enum AuditLogType {
  JobOrderUpdated = 'JobOrder.Updated',
  JobOrderCancelled = 'JobOrder.Cancelled',
  JobOrderUnCancelled = 'JobOrder.UnCancelled',
}

// Describe the list with all available origin which can emit new actions which have to be logged
export enum AuditLogOrigin {
  ClientAccess = 'ClientAccess',
  INFO = 'InFO',
  Bullhorn = 'Bullhorn',
}

// Describe the list with all available entities which can logged
export enum AuditLogEntityName {
  JobOrder = 'JobOrder',
}
