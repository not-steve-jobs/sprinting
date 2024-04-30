export enum BusMessageScopeEnum {
  INFO = 'info',
  DATAPROVIDING = 'dataproviding',
  SALESFORCE = 'salesForce',
}

export enum BusMessageDirectionEnum {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export enum BusMessageTypeEnum {
  COMMAND = 'command',
  EVENT = 'event',
  COMMANDSUCCESS = 'commandSuccess',
  COMMANDERROR = 'commandError',
}

export enum BusMessageStatusEnum {
  CREATED = 'created',
  RECEIVED = 'received',
  SENT = 'sent',
  SUCCESS = 'success',
  FIXED = 'fixed',
  ERROR = 'error',
}
