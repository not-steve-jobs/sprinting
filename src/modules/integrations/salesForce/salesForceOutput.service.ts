import {IntegrationLogs} from './../integrationLogging.service';
import {SalesForceCommands} from './salesForceIntegrationTypes';
import * as dateFns from 'date-fns';
import {CommonIntegrationService} from './../commonIntegration.service';
import {ProcessErrorArgs, ServiceBusMessage, ServiceBusClient} from '@azure/service-bus';
import {Injectable} from '@nestjs/common';
import {BusMessageScopeEnum, BusMessageStatusEnum, BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';
import {AppConfigService} from '../../../core/config/appConfig.service';
import {BusMessage} from '../../busMessage/busMessage.entity';
import {UserCommandsService} from './commands/userCommands.service';
import {IntegrationSystemLogType, LogMessageType} from '../integrationSystem.enum';
import {SalesForceResponse} from './eventModels/salesForceResponse';
import {JobCommandsService} from './commands/jobCommands.service';

@Injectable()
export class SalesForceOutputService {
  private started: boolean = false;

  public constructor(
    private readonly appConfigService: AppConfigService,
    private readonly commonIntegrationService: CommonIntegrationService,
    private readonly userCommandsService: UserCommandsService,
    private readonly jobCommandsService: JobCommandsService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async start() {
    if (this.started) return;

    const {
      commandsEnabled,
      commandsConnectionString,
      outputTopic,
      outputSubscription,
    } = this.appConfigService.salesForceIntegration;

    this.integrationLogs.integrationEnabled(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      LogMessageType.Output,
      commandsEnabled,
    );

    if (!commandsEnabled) {
      return;
    }

    try {
      const serviceBusClient = new ServiceBusClient(commandsConnectionString);
      const receiver = serviceBusClient.createReceiver(outputTopic, outputSubscription, {
        receiveMode: 'receiveAndDelete',
      });
      receiver.subscribe({processMessage: this.onMessage, processError: this.onError});
      this.commonIntegrationService.logIntegrationConnectionInfo(
        LogMessageType.Output,
        outputTopic,
        outputSubscription,
        IntegrationSystemLogType.SalesForceIntegration,
      );
    } catch (e) {
      this.integrationLogs.subscriptionError(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Output,
        e,
      );
    }

    this.started = true;
  }

  private readonly mapping = new Map<string, (busMessage: BusMessage, responseData: string) => Promise<void>>([
    [
      SalesForceCommands.createContact,
      (pairedMessage: BusMessage) => this.userCommandsService.onCreateContactSuccess(pairedMessage),
    ],
    [
      SalesForceCommands.createJob,
      (pairedMessage: BusMessage) => this.jobCommandsService.onCreateJobSuccess(pairedMessage),
    ],
  ]);

  public onMessage = async (message: ServiceBusMessage) => {
    const start = new Date();
    const event = message.body as SalesForceResponse;

    this.integrationLogs.logMessage(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      LogMessageType.Output,
      event,
    );

    try {
      await this.commonIntegrationService.saveCommandResponse(
        event,
        BusMessageTypeEnum.COMMANDSUCCESS,
        BusMessageScopeEnum.SALESFORCE,
      );

      const pairedMessage = await this.commonIntegrationService.pairMessage(
        event,
        BusMessageStatusEnum.SUCCESS,
        IntegrationSystemLogType.SalesForceIntegration,
      );

      if (pairedMessage) {
        if (this.mapping.has(event.CommandName)) {
          await this.mapping.get(event.CommandName)(pairedMessage, event.Data ? event.Data : null);
        } else {
          this.integrationLogs.noHandler(
            __filename,
            IntegrationSystemLogType.SalesForceIntegration,
            LogMessageType.Output,
            event.CommandName,
          );
        }
      }
    } catch (error) {
      this.integrationLogs.processingMessageError(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Output,
        error,
      );

      this.commonIntegrationService.updateCommandResponse(
        event,
        BusMessageStatusEnum.ERROR,
        BusMessageTypeEnum.COMMANDSUCCESS,
        error,
      );
    }

    const delta = dateFns.differenceInMilliseconds(new Date(), start);
    this.integrationLogs.processingTime(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      LogMessageType.Output,
      delta,
    );
  };

  private onError = async ({error}: ProcessErrorArgs) => {
    let match;
    if ((match = error.message?.match(/The messaging entity (.*) could not be found./))) {
      this.integrationLogs.connectionProblem(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Output,
        match[1],
        error,
      );
    } else {
      this.integrationLogs.unhandledError(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Output,
        error,
      );
    }
  };
}
