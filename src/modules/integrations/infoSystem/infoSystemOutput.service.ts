import * as dateFns from 'date-fns';
import {CommonIntegrationService} from './../commonIntegration.service';
import {ProcessErrorArgs, ServiceBusMessage, ServiceBusClient} from '@azure/service-bus';
import {Injectable} from '@nestjs/common';
import {BusMessageScopeEnum, BusMessageStatusEnum, BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';
import {AppConfigService} from '../../../core/config/appConfig.service';
import {InfoSystemResponse} from './eventModels';
import {InfoSystemCommands} from './infoSystemIntegrationTypes';
import {BusMessage} from '../../busMessage/busMessage.entity';
import {FileCommandsService} from './commands/fileCommands.service';
import {JobOrderCommandsService} from './commands/jobOrderCommands.service';
import {UserCommandsService} from './commands/userCommands.service';
import {CaseCommandsService} from './commands/caseCommands.service';
import {IntegrationSystemLogType, LogMessageType} from '../integrationSystem.enum';
import {IntegrationLogs} from '../integrationLogging.service';

@Injectable()
export class InfoSystemOutputService {
  private started: boolean = false;

  public constructor(
    private readonly appConfigService: AppConfigService,
    private readonly commonIntegrationService: CommonIntegrationService,
    private readonly fileCommandsService: FileCommandsService,
    private readonly jobOrderCommands: JobOrderCommandsService,
    private readonly userCommandsService: UserCommandsService,
    private readonly caseCommandsService: CaseCommandsService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async start() {
    if (this.started) return;

    const {
      commandsEnabled,
      commandsConnectionString,
      outputTopic,
      outputSubscription,
    } = this.appConfigService.infoSystemIntegration;

    this.integrationLogs.integrationEnabled(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
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
        IntegrationSystemLogType.InfoSystemIntegration,
      );
    } catch (e) {
      this.integrationLogs.subscriptionError(
        __filename,
        IntegrationSystemLogType.InfoSystemIntegration,
        LogMessageType.Output,
        e,
      );
    }

    this.started = true;
  }

  private readonly mapping = new Map<string, (busMessage: BusMessage, responseData: string) => Promise<void>>([
    [
      InfoSystemCommands.createContact,
      (pairedMessage: BusMessage) => this.userCommandsService.onCreateContactSuccess(pairedMessage),
    ],
    [
      InfoSystemCommands.createDocument,
      (pairedMessage: BusMessage, responseData: string) =>
        this.fileCommandsService.onCreateFileSuccess(pairedMessage, responseData),
    ],
    [
      InfoSystemCommands.createJob,
      (pairedMessage: BusMessage) => this.jobOrderCommands.onCreateJobSuccess(pairedMessage),
    ],
    [
      InfoSystemCommands.createClientCase,
      (pairedMessage: BusMessage) => this.caseCommandsService.onCreateCaseSuccess(pairedMessage),
    ],
  ]);

  public onMessage = async (message: ServiceBusMessage) => {
    const start = new Date();
    const event = message.body as InfoSystemResponse;

    this.integrationLogs.logMessage(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      LogMessageType.Output,
      event,
    );

    try {
      await this.commonIntegrationService.saveCommandResponse(
        event,
        BusMessageTypeEnum.COMMANDSUCCESS,
        BusMessageScopeEnum.INFO,
      );

      const pairedMessage = await this.commonIntegrationService.pairMessage(
        event,
        BusMessageStatusEnum.SUCCESS,
        IntegrationSystemLogType.InfoSystemIntegration,
      );

      if (pairedMessage) {
        if (this.mapping.has(event.CommandName)) {
          await this.mapping.get(event.CommandName)(pairedMessage, event.Data ? event.Data : null);
        } else {
          this.integrationLogs.noHandler(
            __filename,
            IntegrationSystemLogType.InfoSystemIntegration,
            LogMessageType.Output,
            event.CommandName,
          );
        }
      }
    } catch (error) {
      this.integrationLogs.processingMessageError(
        __filename,
        IntegrationSystemLogType.InfoSystemIntegration,
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
      IntegrationSystemLogType.InfoSystemIntegration,
      LogMessageType.Output,
      delta,
    );
  };

  private onError = async ({error}: ProcessErrorArgs) => {
    let match;
    if ((match = error.message?.match(/The messaging entity (.*) could not be found./))) {
      this.integrationLogs.connectionProblem(
        __filename,
        IntegrationSystemLogType.InfoSystemIntegration,
        LogMessageType.Output,
        match[1],
        error,
      );
    } else {
      this.integrationLogs.unhandledError(
        __filename,
        IntegrationSystemLogType.InfoSystemIntegration,
        LogMessageType.Output,
        error,
      );
    }
  };
}
