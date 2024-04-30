import {IntegrationLogs} from './integrationLogging.service';
import {Injectable} from '@nestjs/common';
import {Logger} from 'src/core/logger';
import {
  BusMessageDirectionEnum,
  BusMessageScopeEnum,
  BusMessageStatusEnum,
  BusMessageTypeEnum,
} from '../busMessage/busMessage.enum';
import {BusMessageService} from '../busMessage/busMessage.service';
import {PlainObject} from '../common/common.dto';
import {InfoSystemResponse, InfoSystemErrorResponse} from './infoSystem/eventModels';
import {IntegrationSystemLogType, LogMessageType, ProcessingPlace} from './integrationSystem.enum';
import {SalesForceErrorResponse} from './salesForce/eventModels/salesForceErrorResponse';

@Injectable()
export class CommonIntegrationService {
  public constructor(
    private readonly logger: Logger,
    private readonly busMessageService: BusMessageService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public logIntegrationConnectionInfo(
    logType: LogMessageType,
    topicName: string,
    subscriptionName: string,
    scope: IntegrationSystemLogType,
  ) {
    this.logger.info(
      __filename,
      `\n\t${scope}: Start listening messages\n\n\t\t[${logType.toUpperCase()}] topic\t\t->\t${topicName}\n\t\t[${logType.toUpperCase()}] subscription\t->\t${subscriptionName}\n`,
    );
  }

  public async saveCommand(sendObject: PlainObject, scope: BusMessageScopeEnum) {
    const busMessageData = {
      scope,
      direction: BusMessageDirectionEnum.OUTBOUND,
      messageName: sendObject.body.commandName,
      messageId: sendObject.body.commandId,
      type: BusMessageTypeEnum.COMMAND,
      payload: sendObject,
      status: BusMessageStatusEnum.CREATED,
    };
    return await this.busMessageService.create(busMessageData);
  }

  public async saveEvent(
    event: PlainObject,
    status: BusMessageStatusEnum = BusMessageStatusEnum.RECEIVED,
    scope: BusMessageScopeEnum,
    error: any = null,
    fixedBy: string = null,
  ) {
    const busMessageData = {
      scope,
      direction: BusMessageDirectionEnum.INBOUND,
      messageName: event.eventName,
      messageId: event.eventId,
      type: BusMessageTypeEnum.EVENT,
      payload: event,
      status: status,
      internalError: error,
      fixedBy,
    };
    return await this.busMessageService.create(busMessageData);
  }

  public async updateEvent(
    event: PlainObject,
    status: BusMessageStatusEnum,
    error: any = null,
    fixedBy: string = null,
  ) {
    const busMessageData = {
      messageName: event.eventName,
      messageId: event.eventId,
      type: BusMessageTypeEnum.EVENT,
      status,
      internalError: error,
      fixedBy,
    };
    return await this.busMessageService.update(busMessageData);
  }

  public async pairMessage(event: InfoSystemResponse, status: BusMessageStatusEnum, scope: IntegrationSystemLogType) {
    const busMessageData = {
      messageName: event.CommandName,
      messageId: event.CommandId,
      type: BusMessageTypeEnum.COMMAND,
      payload: event,
      status,
    };
    const busMessage = await this.busMessageService.update(busMessageData);
    this.logger.info(
      __filename,
      this.integrationLogs.formatIntegrationLogMessage(
        scope,
        LogMessageType.Output,
        ProcessingPlace.Pairing,
        JSON.stringify(busMessage, null, 4),
      ),
    );
    this.integrationLogs.pairingMessage(__filename, scope, LogMessageType.SuccessEvent, '', {event, busMessage});

    return busMessage;
  }

  public async pairErrorMessage(
    event: InfoSystemErrorResponse | SalesForceErrorResponse,
    status: BusMessageStatusEnum,
    scope: IntegrationSystemLogType,
  ) {
    const busMessageData = {
      messageName: event.commandName,
      messageId: event.commandId,
      type: BusMessageTypeEnum.COMMAND,
      payload: event,
      status,
    };
    const busMessage = await this.busMessageService.update(busMessageData);
    this.integrationLogs.pairingMessage(__filename, scope, LogMessageType.ErrorEvent, '', {event, busMessage});

    return busMessage;
  }

  public async saveCommandResponse(event: InfoSystemResponse, type: BusMessageTypeEnum, scope: BusMessageScopeEnum) {
    const busMessageData = {
      scope,
      direction: BusMessageDirectionEnum.INBOUND,
      messageName: event.CommandName,
      messageId: event.CommandId,
      type,
      payload: event,
      status: BusMessageStatusEnum.RECEIVED,
    };
    return await this.busMessageService.create(busMessageData);
  }

  public async saveCommandErrorResponse(
    event: InfoSystemErrorResponse,
    type: BusMessageTypeEnum,
    scope: BusMessageScopeEnum,
  ) {
    const busMessageData = {
      scope,
      direction: BusMessageDirectionEnum.INBOUND,
      messageName: event.commandName,
      messageId: event.commandId,
      type,
      payload: event,
      status: BusMessageStatusEnum.RECEIVED,
    };
    return await this.busMessageService.create(busMessageData);
  }

  public async updateCommandResponse(
    event: PlainObject,
    status: BusMessageStatusEnum,
    type: BusMessageTypeEnum,
    error: any = null,
  ) {
    const busMessageData = {
      messageName: event.CommandName,
      messageId: event.CommandId,
      type,
      status,
      internalError: error,
    };
    return await this.busMessageService.update(busMessageData);
  }

  public async saveEventAttempt(busMessageId: string) {
    const busMessageAttemptData = {
      busMessageId,
      status: BusMessageStatusEnum.RECEIVED,
    };
    return await this.busMessageService.createAttempt(busMessageAttemptData);
  }

  public async updateEventAttempt(
    busMessageAttemptId: string,
    status: BusMessageStatusEnum,
    fixedBy: string,
    error: any = null,
  ) {
    const busMessageAttemptData = {
      status,
      fixedBy,
      internalError: error,
    };
    return await this.busMessageService.updateAttempt(busMessageAttemptId, busMessageAttemptData);
  }

  public async saveCommandAttempt(busMessageId: string, fixedBy: string) {
    const busMessageAttemptData = {
      busMessageId,
      status: BusMessageStatusEnum.CREATED,
      fixedBy,
    };
    return await this.busMessageService.createAttempt(busMessageAttemptData);
  }
}
