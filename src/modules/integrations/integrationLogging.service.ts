import {SalesForceCommandObject} from './salesForce/salesForceIntegrationTypes';
import {BusMessage} from './../busMessage/busMessage.entity';
import {SalesForceEvent} from './salesForce/eventModels/salesForceEvent';
import {Injectable} from '@nestjs/common';
import {Logger} from 'src/core/logger';
import {InfoSystemErrorResponse} from './infoSystem/eventModels';
import {InfoSystemCommandObject} from './infoSystem/infoSystemIntegrationTypes';
import {IntegrationSystemLogType, LogMessageType, ProcessingPlace} from './integrationSystem.enum';
import {SalesForceErrorResponse} from './salesForce/eventModels/salesForceErrorResponse';
import {PlainObject} from '../common/common.dto';
import {SalesForceResponse} from './salesForce/eventModels/salesForceResponse';
import {DataProvidingEventObject} from './dataProviding/dataProvidingIntegrationTypes';
@Injectable()
export class IntegrationLogs {
  public constructor(private readonly logger: Logger) {}

  /**
   * Format messages related to integrations
   *
   * @param {IntegrationSystemLogType} [integrationType=IntegrationSystemLogType.Unknown] - type of system
   * @param {LogMessageType} [logMessageType=LogMessageType.Unknown] - type of message
   * @param {ProcessingPlace} [processingPlace=ProcessingPlace.Unknown] - from which place we are triggering this log
   * @param {string} message - some additional information
   * @return {*}  {string} - formatted string
   * @memberof CommonIntegrationService
   */
  public formatIntegrationLogMessage(
    integrationType: IntegrationSystemLogType = IntegrationSystemLogType.Unknown,
    logMessageType: LogMessageType = LogMessageType.Unknown,
    processingPlace: ProcessingPlace = ProcessingPlace.Unknown,
    message: string = '',
  ): string {
    return `${integrationType}[${logMessageType}][${processingPlace}]: ${message}`;
  }

  /**
   * General case for logging info messages, if other members of this class do not provide desired log
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {LogMessageType} messageType
   * @param {ProcessingPlace} processingPlace
   * @param {string} [message=''] - some message
   * @param {PlainObject} [data={}] - some additional data
   * @memberof IntegrationLogs
   */
  public generalInfoLog(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    messageType: LogMessageType,
    processingPlace: ProcessingPlace,
    message: string = '',
    data: PlainObject = {},
  ): void {
    this.logger.info(
      __filename,
      this.formatIntegrationLogMessage(integrationSystemLogType, messageType, processingPlace, message),
      data,
    );
  }
  /**
   * General case for logging error messages, if other members of this class do not provide desired log
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {LogMessageType} messageType
   * @param {ProcessingPlace} processingPlace
   * @param {string} [message=''] - some error message
   * @param {Error} [error] - some error
   * @memberof IntegrationLogs
   */
  public generalErrorLog(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    messageType: LogMessageType,
    processingPlace: ProcessingPlace,
    message: string = '',
    error?: Error,
  ): void {
    this.logger.error(
      __filename,
      this.formatIntegrationLogMessage(integrationSystemLogType, messageType, processingPlace, message),
      error,
    );
  }

  /**
   * Information about enabled/disabled integrations
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {LogMessageType} messageType
   * @param {boolean} messagesEnabled
   * @memberof IntegrationLogs
   */
  public integrationEnabled(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    messageType: LogMessageType,
    messagesEnabled: boolean,
  ): void {
    this.logger.info(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        messageType,
        ProcessingPlace.MainService,
        `Sync is ${messagesEnabled ? 'enabled' : 'disabled'}`,
      ),
    );
  }

  /**
   * All commands must have destination system
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {{
   *       commandName: string;
   *       brand: string;
   *       country: string;
   *     }} data
   * @memberof IntegrationLogs
   */
  public missingDestinationSystem(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    data: {
      commandName: string;
      brand: string;
      country: string;
    },
  ): void {
    this.logger.info(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        LogMessageType.Command,
        ProcessingPlace.DestinationSystemMissing,
        `Missing destination system for command [${data.commandName}]`,
      ),
      data,
    );
  }

  /**
   * Log command message before send
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {string} topic
   * @param {InfoSystemCommandObject} data
   * @memberof IntegrationLogs
   */
  public logCommand(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    topic: string,
    data: InfoSystemCommandObject | SalesForceCommandObject | DataProvidingEventObject,
  ): void {
    this.logger.info(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        LogMessageType.Command,
        ProcessingPlace.OutboundMessage,
        `Message for topic: ${topic}`,
      ),
      data,
    );
  }

  /**
   * Log error occurred while sending command
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {string} topic
   * @param {Error} error
   * @memberof IntegrationLogs
   */
  public sendCommandMessageError(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    topic: string,
    error: Error,
  ): void {
    this.logger.error(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        LogMessageType.Command,
        ProcessingPlace.MainService,
        `Error for ${topic}: ${error}`,
      ),
      error,
    );
  }

  /**
   * Log errors generated by events sent to some of internal common BE
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {string} [message='']
   * @param {Error} error
   * @memberof IntegrationLogs
   */
  public sendInternalEventError(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    eventName: string = '-',
    error: Error,
  ): void {
    this.logger.error(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        LogMessageType.Event,
        ProcessingPlace.EventHandler,
        `Error for ${eventName}`,
      ),
      error,
    );
  }

  /**
   * Log error occurred while trying to subscribe for messages
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {LogMessageType} logMessageType
   * @param {Error} error
   * @memberof IntegrationLogs
   */
  public subscriptionError(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    logMessageType: LogMessageType,
    error: Error,
  ): void {
    this.logger.error(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        logMessageType,
        // LogMessageType.Error,
        ProcessingPlace.MainService,
        'Subscription error',
      ),
      error,
    );
  }

  /**
   * Log messages received by error topic
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {LogMessageType} logMessageType
   * @param {(SalesForceErrorResponse | InfoSystemErrorResponse | SalesForceEvent | SalesForceResponse | BusMessage)} eventData
   * @memberof IntegrationLogs
   */
  public logMessage(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    logMessageType: LogMessageType,
    eventData: SalesForceErrorResponse | InfoSystemErrorResponse | SalesForceEvent | SalesForceResponse | BusMessage,
  ): void {
    this.logger.info(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        logMessageType,
        ProcessingPlace.EventListener,
        `Message: ${JSON.stringify(eventData, null, 4)}`,
      ),
    );
  }

  /**
   * Log messages within event handlers
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {string} [message=''] - some message
   * @param {PlainObject} [data={}] - some data
   * @memberof IntegrationLogs
   */
  public logMessageHandler(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    message: string = '',
    data: PlainObject = {},
  ): void {
    this.logger.info(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        LogMessageType.Event,
        ProcessingPlace.EventHandler,
        message,
      ),
      data,
    );
  }

  /**
   * Log for messages which do not have defined handler in CLP BE
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {LogMessageType} logMessageType
   * @param {string} messageName - received message name
   * @memberof IntegrationLogs
   */
  public noHandler(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    logMessageType: LogMessageType,
    messageName: string,
  ): void {
    this.logger.info(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        logMessageType,
        ProcessingPlace.SkippingMessage,
        `No Handler for ${messageName}`,
      ),
    );
  }

  /**
   * Log handled error for some message
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {LogMessageType} logMessageType
   * @param {Error} error
   * @param {PlainObject} [additionalData]
   * @memberof IntegrationLogs
   */
  public processingMessageError(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    logMessageType: LogMessageType,
    error: Error,
    additionalData?: PlainObject,
  ): void {
    this.logger.error(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        logMessageType,
        ProcessingPlace.EventListener,
        `Handled error while processing message, ${error.message} ${error.stack}`,
      ),
      {error, data: additionalData ?? {}},
    );
  }

  /**
   * Duration of message processing (time must be provided)
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {LogMessageType} logMessageType
   * @param {number} time - time in milliseconds
   * @memberof IntegrationLogs
   */
  public processingTime(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    logMessageType: LogMessageType,
    time: number,
  ): void {
    this.logger.info(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        logMessageType,
        ProcessingPlace.ProcessTime,
        `Message processed in ${time} ms`,
      ),
    );
  }

  /**
   * Connection problem while trying to subscribe to a topic/subscription
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {LogMessageType} logMessageType
   * @param {string} topic
   * @param {Error} error
   * @memberof IntegrationLogs
   */
  public connectionProblem(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    logMessageType: LogMessageType,
    topic: string,
    error: Error,
  ): void {
    this.logger.error(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        logMessageType,
        ProcessingPlace.ConnectionProblem,
        `Couldn't connect to ${topic}`,
      ),
      error,
    );
  }

  /**
   * Log unhandled errors
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {LogMessageType} logMessageType
   * @param {Error} error
   * @memberof IntegrationLogs
   */
  public unhandledError(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    logMessageType: LogMessageType,
    error: Error,
  ): void {
    this.logger.error(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        logMessageType,
        ProcessingPlace.UnhandledError,
        `Unhandled error while processing message ${error.message} ${error.stack}`,
      ),
      error,
    );
  }

  /**
   * Log mapped user permissions
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {string[]} [permissionNames=[]]
   * @memberof IntegrationLogs
   */
  public mappedPermissions(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    permissionNames: string[] = [],
  ): void {
    this.logger.info(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        LogMessageType.Event,
        ProcessingPlace.MappedPermissions,
        `[${permissionNames.join(', ')}]`,
      ),
    );
  }

  /**
   * Used for command success/error topics. Corresponding event handlers can use this
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {(LogMessageType.SuccessEvent | LogMessageType.ErrorEvent)} logMessageType
   * @param {string} [message='']
   * @param {PlainObject} [data]
   * @memberof IntegrationLogs
   */
  public commandResponseEvent(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    logMessageType: LogMessageType.SuccessEvent | LogMessageType.ErrorEvent,
    message: string = '',
    data?: PlainObject,
  ): void {
    this.logger.info(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        logMessageType,
        ProcessingPlace.CommandHandler,
        message,
      ),
      data,
    );
  }

  /**
   * Log paired messages for error and output topics
   *
   * @param {string} __filename
   * @param {IntegrationSystemLogType} integrationSystemLogType
   * @param {(LogMessageType.SuccessEvent | LogMessageType.ErrorEvent)} logMessageType
   * @param {string} [message='']
   * @param {PlainObject} [data]
   * @memberof IntegrationLogs
   */
  public pairingMessage(
    __filename: string,
    integrationSystemLogType: IntegrationSystemLogType,
    logMessageType: LogMessageType.SuccessEvent | LogMessageType.ErrorEvent,
    message: string = '',
    data?: PlainObject,
  ): void {
    this.logger.info(
      __filename,
      this.formatIntegrationLogMessage(
        integrationSystemLogType,
        logMessageType,
        ProcessingPlace.Pairing,
        `Pairing done: ${message}`,
      ),
      data,
    );
  }
}
