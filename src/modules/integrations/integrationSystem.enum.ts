export enum IntegrationSystemLogType {
  InfoSystemIntegration = 'InfoSystemIntegration',
  SalesForceIntegration = 'SalesForceIntegration',
  DataProviding = 'DataProviding',
  Unknown = 'UNKNOWN',
}

export enum LogMessageType {
  Event = 'Event',
  Command = 'Command',
  Output = 'Output',
  Error = 'Error',
  Fix = 'Fix',
  SuccessEvent = 'SuccessEvent',
  ErrorEvent = 'ErrorEvent',
  Unknown = 'UNKNOWN',
}

export enum ProcessingPlace {
  // general places
  CommandHandler = 'CommandHandler',
  CommandSuccessHandler = 'CommandSuccessHandler',
  CommandErrorHandler = 'CommandErrorHandler',
  OutboundMessage = 'OutboundMessage',
  EventHandler = 'EventHandler',
  EventListener = 'EventListener',
  MainService = 'MainService',
  SkippingMessage = 'SkippingMessage',
  ProcessTime = 'ProcessTime',
  ConnectionProblem = 'ConnectionProblem',
  UnhandledError = 'UnhandledError',
  Pairing = 'Pairing',
  DestinationSystemMissing = 'DestinationSystemMissing',
  FixHandler = 'FixHandler',
  Unknown = 'UNKNOWN',

  // custom places
  CoordinatesError = 'CoordinatesError',
  TimezoneError = 'TimezoneError',
  MappedPermissions = 'MappedPermissions',
}
