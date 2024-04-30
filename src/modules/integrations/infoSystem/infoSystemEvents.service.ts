import * as dateFns from 'date-fns';
import {CommonIntegrationService} from './../commonIntegration.service';
import {SkilsEventsService} from './events/skilsEvents.service';
import {JobOrderEventsService} from './events/jobOrderEvents.service';
import {ServiceBusMessage, ServiceBusClient, ProcessErrorArgs} from '@azure/service-bus';
import {Injectable} from '@nestjs/common';
import {AppConfigService} from '../../../core/config/appConfig.service';
import {InfoSystemEvents} from './infoSystemIntegrationTypes';
import {
  InfoSystemEvent,
  JobUpdatedData,
  BranchCreatedData,
  BranchUpdatedData,
  BranchAccountUpdatedData,
  BranchAccountCreatedData,
  JobSkillUpdatedData,
  JobSkillCreatedData,
  JobSkillDeletedData,
  DocumentCreatedData,
  PersonalDocumentCreatedData,
  AccountUpdatedData,
  AccountCreatedData,
  ClientCaseUpdatedData,
  ClientCaseCommentCreatedData,
  ClientAdminInvitedData,
  ContactCreatedData,
  ContactUpdatedData,
  PortalAccessUpdatedData,
  JobCreatedData,
  GipEventWithExtendedProps,
} from './eventModels';
import {LocationEventsService} from './events/locationEvents.service';
import {UserEventsService} from './events/userEvents.service';
import {CaseEventsService} from './events/caseEvents.service';
import {BranchEventsService} from './events/branchEvents.service';
import {FileEventsService} from './events/fileEvents.service';
import {BusMessageScopeEnum, BusMessageStatusEnum} from '../../busMessage/busMessage.enum';
import {JobProcessUpdatedData} from './eventModels/jobProcessUpdatedData';
import {DataMigrationEventsService} from '../dataMigration/dataMigration.service';
import {IntegrationSystemLogType, LogMessageType} from '../integrationSystem.enum';
import {IntegrationLogs} from '../integrationLogging.service';

@Injectable()
export class InfoSystemEventsService {
  private started: boolean = false;

  public constructor(
    private readonly appConfigService: AppConfigService,
    private readonly jobOrderEventsService: JobOrderEventsService,
    private readonly skilsEventsService: SkilsEventsService,
    private readonly commonIntegrationService: CommonIntegrationService,
    private readonly locationEventsService: LocationEventsService,
    private readonly userEventsService: UserEventsService,
    private readonly caseEventsService: CaseEventsService,
    private readonly branchEventsService: BranchEventsService,
    private readonly fileEventsService: FileEventsService,
    private readonly dataMigrationService: DataMigrationEventsService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async start() {
    if (this.started) return;

    const {
      eventsEnabled,
      eventsConnectionString,
      eventsTopic,
      eventsSubscription,
    } = this.appConfigService.infoSystemIntegration;

    this.integrationLogs.integrationEnabled(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      LogMessageType.Event,
      eventsEnabled,
    );

    if (!eventsEnabled) {
      return;
    }

    try {
      const serviceBusClient = new ServiceBusClient(eventsConnectionString);
      const receiver = serviceBusClient.createReceiver(eventsTopic, eventsSubscription, {
        receiveMode: 'receiveAndDelete',
      });
      receiver.subscribe({processMessage: this.onMessage, processError: this.onError});
      this.commonIntegrationService.logIntegrationConnectionInfo(
        LogMessageType.Event,
        eventsTopic,
        eventsSubscription,
        IntegrationSystemLogType.InfoSystemIntegration,
      );
    } catch (e) {
      this.integrationLogs.subscriptionError(
        __filename,
        IntegrationSystemLogType.InfoSystemIntegration,
        LogMessageType.Event,
        e,
      );
    }

    this.started = true;
  }

  public readonly mapping = new Map<string, <T>(event: InfoSystemEvent<T>) => Promise<void>>([
    [
      InfoSystemEvents.contactCreated,
      (event: InfoSystemEvent<ContactCreatedData> | any) => this.userEventsService.onContactCreated(event),
    ],
    [
      InfoSystemEvents.contactUpdated,
      (event: InfoSystemEvent<ContactUpdatedData>) => this.userEventsService.onContactUpdated(event),
    ],
    [
      InfoSystemEvents.accountCreated,
      (event: InfoSystemEvent<AccountCreatedData>) => this.locationEventsService.onAccountCreated(event),
    ],
    [
      InfoSystemEvents.accountUpdated,
      (event: InfoSystemEvent<AccountUpdatedData>) => this.locationEventsService.onAccountUpdated(event),
    ],
    [
      InfoSystemEvents.clientAdminInvited,
      (event: InfoSystemEvent<ClientAdminInvitedData> | any) => this.userEventsService.onClientAdminInvited(event),
    ],
    [
      InfoSystemEvents.portalAccessUpdated,
      (event: InfoSystemEvent<PortalAccessUpdatedData> | any) => this.userEventsService.onPortalAccessUpdated(event),
    ],
    [
      InfoSystemEvents.clientCaseUpdated,
      (event: InfoSystemEvent<ClientCaseUpdatedData>) => this.caseEventsService.onClientCaseUpdated(event),
    ],
    [
      InfoSystemEvents.clientCaseCommentCreated,
      (event: InfoSystemEvent<ClientCaseCommentCreatedData>) =>
        this.caseEventsService.onClientCaseCommentCreated(event),
    ],
    [
      InfoSystemEvents.jobProcessCreated,
      (event: InfoSystemEvent<any>) => this.jobOrderEventsService.onJobProcessCreated(event),
    ],
    [
      InfoSystemEvents.jobProcessUpdated,
      (event: InfoSystemEvent<JobProcessUpdatedData>) => this.jobOrderEventsService.onJobProcessUpdated(event),
    ],
    [
      InfoSystemEvents.jobUpdated,
      (event: InfoSystemEvent<JobUpdatedData>) => this.jobOrderEventsService.onJobUpdated(event),
    ],
    [
      InfoSystemEvents.branchCreated,
      (event: InfoSystemEvent<BranchCreatedData>) => this.branchEventsService.onBranchCreated(event),
    ],
    [
      InfoSystemEvents.branchUpdated,
      (event: InfoSystemEvent<BranchUpdatedData>) => this.branchEventsService.onBranchUpdated(event),
    ],
    [
      InfoSystemEvents.branchAccountCreated,
      (event: InfoSystemEvent<BranchAccountCreatedData>) => this.branchEventsService.onBranchAccountCreated(event),
    ],
    [
      InfoSystemEvents.branchAccountUpdated,
      (event: InfoSystemEvent<BranchAccountUpdatedData>) => this.branchEventsService.onBranchAccountUpdated(event),
    ],
    [
      InfoSystemEvents.jobCreated,
      (event: InfoSystemEvent<JobCreatedData>) => this.jobOrderEventsService.onJobCreated(event),
    ],
    [
      InfoSystemEvents.jobSkillsCreated,
      (event: InfoSystemEvent<JobSkillCreatedData>) => this.skilsEventsService.jobSkillsCreated(event),
    ],
    [
      InfoSystemEvents.jobSkillsUpdated,
      (event: InfoSystemEvent<JobSkillUpdatedData>) => this.skilsEventsService.jobSkillsUpdated(event),
    ],
    [
      InfoSystemEvents.jobSkillsDeleted,
      (event: InfoSystemEvent<JobSkillDeletedData>) => this.skilsEventsService.jobSkillDeleted(event),
    ],
    [
      InfoSystemEvents.documentCreated,
      (event: InfoSystemEvent<DocumentCreatedData>) => this.fileEventsService.onDocumentCreated(event),
    ],
    [
      InfoSystemEvents.personalDocumentCreated,
      (event: InfoSystemEvent<PersonalDocumentCreatedData>) => this.fileEventsService.onPersonalDocumentCreated(event),
    ],
    [
      InfoSystemEvents.bulkCustomerCreated,
      (event: GipEventWithExtendedProps) => this.dataMigrationService.onBulkCustomerCreated(event),
    ],
    [
      InfoSystemEvents.bulkLocationCreated,
      (event: GipEventWithExtendedProps) => this.dataMigrationService.onBulkLocationCreated(event),
    ],
    [
      InfoSystemEvents.bulkContactCreated,
      (event: GipEventWithExtendedProps) => this.dataMigrationService.onBulkContactCreated(event),
    ],
  ]);

  public onMessage = async (message: ServiceBusMessage) => {
    const start = new Date();
    const event = message.body as InfoSystemEvent;
    let busMessageEvent;

    this.integrationLogs.logMessage(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      LogMessageType.Event,
      event,
    );

    try {
      if (this.mapping.has(event.eventName)) {
        await this.mapping.get(event.eventName)(event);
        if (this.appConfigService.infoSystemIntegration.eventLogsEnabled) {
          busMessageEvent = await this.commonIntegrationService.saveEvent(
            event,
            BusMessageStatusEnum.RECEIVED,
            BusMessageScopeEnum.INFO,
          );
        }
      } else {
        this.integrationLogs.noHandler(
          __filename,
          IntegrationSystemLogType.InfoSystemIntegration,
          LogMessageType.Event,
          event.eventName,
        );
        busMessageEvent = await this.commonIntegrationService.saveEvent(
          event,
          BusMessageStatusEnum.ERROR,
          BusMessageScopeEnum.INFO,
        );
      }
    } catch (error) {
      this.integrationLogs.processingMessageError(
        __filename,
        IntegrationSystemLogType.InfoSystemIntegration,
        LogMessageType.Event,
        error,
        event,
      );
      busMessageEvent = await this.commonIntegrationService.saveEvent(
        event,
        BusMessageStatusEnum.ERROR,
        BusMessageScopeEnum.INFO,
        error,
      );
    }

    const delta = dateFns.differenceInMilliseconds(new Date(), start);
    this.integrationLogs.processingTime(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      LogMessageType.Event,
      delta,
    );

    return busMessageEvent;
  };

  private onError = async ({error}: ProcessErrorArgs) => {
    let match;
    if ((match = error.message?.match(/The messaging entity (.*) could not be found./))) {
      this.integrationLogs.connectionProblem(
        __filename,
        IntegrationSystemLogType.InfoSystemIntegration,
        LogMessageType.Event,
        match[1],
        error,
      );
    } else {
      this.integrationLogs.unhandledError(
        __filename,
        IntegrationSystemLogType.InfoSystemIntegration,
        LogMessageType.Event,
        error,
      );
    }
  };
}
