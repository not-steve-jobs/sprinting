import {SalesForceCommandsService} from './salesForceCommands.service';
import {SalesForceCommands} from './salesForceIntegrationTypes';
import * as dateFns from 'date-fns';
import {CommonIntegrationService} from './../commonIntegration.service';
import {ServiceBusMessage, ServiceBusClient, ProcessErrorArgs} from '@azure/service-bus';
import {Injectable} from '@nestjs/common';
import {AppConfigService} from '../../../core/config/appConfig.service';
import {BusMessage} from '../../busMessage/busMessage.entity';
import {BusMessageScopeEnum, BusMessageStatusEnum, BusMessageTypeEnum} from '../../busMessage/busMessage.enum';
import {UserCommandsService} from './commands/userCommands.service';
import {BusMessageService} from 'src/modules/busMessage/busMessage.service';
import {IntegrationSystemLogType, LogMessageType} from '../integrationSystem.enum';
import {SalesForceErrorResponse} from './eventModels/salesForceErrorResponse';
import {IntegrationLogs} from '../integrationLogging.service';

@Injectable()
export class SalesForceErrorService {
  private started: boolean = false;

  public constructor(
    private readonly appConfigService: AppConfigService,
    private readonly commonIntegrationService: CommonIntegrationService,
    private readonly userCommandsService: UserCommandsService,
    private readonly busMessageService: BusMessageService,
    private readonly salesForceCommandsService: SalesForceCommandsService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async start() {
    if (this.started) return;

    const {
      commandsEnabled,
      commandsConnectionString,
      errorTopic,
      errorSubscription,
    } = this.appConfigService.salesForceIntegration;

    this.integrationLogs.integrationEnabled(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      LogMessageType.Error,
      commandsEnabled,
    );

    if (!commandsEnabled) {
      return;
    }

    try {
      const serviceBusClient = new ServiceBusClient(commandsConnectionString);
      const receiver = serviceBusClient.createReceiver(errorTopic, errorSubscription, {
        receiveMode: 'receiveAndDelete',
      });
      receiver.subscribe({processMessage: this.onMessage, processError: this.onError});
      this.commonIntegrationService.logIntegrationConnectionInfo(
        LogMessageType.Error,
        errorTopic,
        errorSubscription,
        IntegrationSystemLogType.SalesForceIntegration,
      );
    } catch (e) {
      this.integrationLogs.subscriptionError(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Error,
        e,
      );
    }

    this.started = true;
  }

  private readonly mapping = new Map<string, (busMessage: BusMessage) => Promise<void>>([
    [
      SalesForceCommands.createContact,
      (pairedMessage: BusMessage) => this.userCommandsService.onCreateContactError(pairedMessage),
    ],
  ]);

  public onMessage = async (message: ServiceBusMessage) => {
    const start = new Date();
    const event = message.body as SalesForceErrorResponse;

    this.integrationLogs.logMessage(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      LogMessageType.Error,
      event,
    );

    try {
      await this.commonIntegrationService.saveCommandErrorResponse(
        event,
        BusMessageTypeEnum.COMMANDERROR,
        BusMessageScopeEnum.SALESFORCE,
      );
      const pairedMessage = await this.commonIntegrationService.pairErrorMessage(
        event,
        BusMessageStatusEnum.ERROR,
        IntegrationSystemLogType.SalesForceIntegration,
      );
      if (pairedMessage) {
        if (this.mapping.has(event.commandName)) {
          await this.mapping.get(event.commandName)(pairedMessage);
        } else {
          this.integrationLogs.noHandler(
            __filename,
            IntegrationSystemLogType.SalesForceIntegration,
            LogMessageType.Error,
            event.commandName,
          );
        }

        //command attempts
        if (event.parameters.data) {
          const errorText: string = event.parameters.data;
          if (
            errorText.indexOf('UNABLE_TO_LOCK_ROW') >= 0 ||
            errorText.indexOf('An error occurred while sending the request') >= 0
          ) {
            const attemptsCount = await this.busMessageService.getAttemptsCount(pairedMessage.id);
            if (attemptsCount < 3) {
              const {id, payload} = pairedMessage;
              this.salesForceCommandsService.execute(payload.body, payload.userProperties, id, 'send attempt');
            }
          }
        }
      }
    } catch (error) {
      this.integrationLogs.processingMessageError(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Error,
        error,
      );
    }

    const delta = dateFns.differenceInMilliseconds(new Date(), start);
    this.integrationLogs.processingTime(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      LogMessageType.Error,
      delta,
    );
  };

  private onError = async ({error}: ProcessErrorArgs) => {
    let match;
    if ((match = error.message?.match(/The messaging entity (.*) could not be found./))) {
      this.integrationLogs.connectionProblem(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Error,
        match[1],
        error,
      );
    } else {
      this.integrationLogs.unhandledError(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Error,
        error,
      );
    }
  };
}
