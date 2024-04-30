import * as dateFns from 'date-fns';
import {CommonIntegrationService} from './../commonIntegration.service';
import {ServiceBusMessage, ServiceBusClient, ProcessErrorArgs} from '@azure/service-bus';
import {Injectable} from '@nestjs/common';
import {AppConfigService} from '../../../core/config/appConfig.service';
import {SalesForceEvents} from './salesForceIntegrationTypes';
import {CustomerCreatedData, SalesForceEvent, ContactCreatedData} from './eventModels';
import {BusMessageScopeEnum, BusMessageStatusEnum} from '../../busMessage/busMessage.enum';
import {CustomerEventsService} from './events/customerEvents.service';
import {AccountCreatedData} from './eventModels/accountCreatedData';
import {CustomerUpdatedData} from './eventModels/customerUpdatedData';
import {UserEventsService} from './events/userEvents.service';
import {LocationEventsService} from './events/locationEventsService.service';
import {AccountUpdatedData} from './eventModels/accountUpdatedData';
import {IntegrationSystemLogType, LogMessageType} from '../integrationSystem.enum';
import {IntegrationLogs} from '../integrationLogging.service';
import {ContactUpdatedData} from './eventModels/contactUpdatedData';
import {ClientAdminInvitedData} from './eventModels/clientAdminInvitedData';
import {JobOrderEventsService} from './events/jobOrderEvents.service';
import {JobCreatedData} from './eventModels/jobCreatedData';

@Injectable()
export class SalesForceEventsService {
  private started: boolean = false;

  public constructor(
    private readonly appConfigService: AppConfigService,
    private readonly commonIntegrationService: CommonIntegrationService,
    private readonly customerEventsService: CustomerEventsService,
    private readonly userEventsService: UserEventsService,
    private readonly locationEventsService: LocationEventsService,
    private readonly integrationLogs: IntegrationLogs,
    private readonly jobOrderEventsService: JobOrderEventsService,
  ) {}

  public async start() {
    if (this.started) return;

    const {
      eventsEnabled,
      eventsConnectionString,
      eventsTopic,
      eventsSubscription,
    } = this.appConfigService.salesForceIntegration;

    this.integrationLogs.integrationEnabled(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
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
        IntegrationSystemLogType.SalesForceIntegration,
      );
    } catch (e) {
      this.integrationLogs.subscriptionError(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Event,
        e,
      );
    }

    this.started = true;
  }

  public readonly mapping = new Map<string, <T>(event: SalesForceEvent<T>) => Promise<void>>([
    [
      SalesForceEvents.customerCreated,
      (event: SalesForceEvent<CustomerCreatedData> | any) => this.customerEventsService.onCustomerCreated(event),
    ],
    [
      SalesForceEvents.customerUpdated,
      (event: SalesForceEvent<CustomerUpdatedData> | any) => this.customerEventsService.onCustomerUpdated(event),
    ],
    [
      SalesForceEvents.contactCreated,
      (event: SalesForceEvent<ContactCreatedData> | any) => this.userEventsService.onContactCreated(event),
    ],
    [
      SalesForceEvents.contactUpdated,
      (event: SalesForceEvent<ContactUpdatedData> | any) => this.userEventsService.onContactUpdated(event),
    ],
    [
      SalesForceEvents.clientAdminInvited,
      (event: SalesForceEvent<ClientAdminInvitedData> | any) => this.userEventsService.onClientAdminInvited(event),
    ],
    [
      SalesForceEvents.accountCreated,
      (event: SalesForceEvent<AccountCreatedData>) => this.locationEventsService.onAccountCreated(event),
    ],
    [
      SalesForceEvents.accountUpdated,
      (event: SalesForceEvent<AccountUpdatedData>) => this.locationEventsService.onAccountUpdated(event),
    ],
    [
      SalesForceEvents.jobCreated,
      (event: SalesForceEvent<JobCreatedData>) => this.jobOrderEventsService.onJobCreated(event),
    ],
  ]);

  private onMessage = async (message: ServiceBusMessage) => {
    const start = new Date();
    const event = message.body as SalesForceEvent;

    this.integrationLogs.logMessage(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      LogMessageType.Event,
      event,
    );

    try {
      if (this.mapping.has(event.eventName)) {
        await this.mapping.get(event.eventName)(event);
        if (this.appConfigService.salesForceIntegration.eventLogsEnabled) {
          this.commonIntegrationService.saveEvent(event, BusMessageStatusEnum.RECEIVED, BusMessageScopeEnum.SALESFORCE);
        }
      } else {
        this.integrationLogs.noHandler(
          __filename,
          IntegrationSystemLogType.SalesForceIntegration,
          LogMessageType.Event,
          event.eventName,
        );

        await this.commonIntegrationService.saveEvent(
          event,
          BusMessageStatusEnum.ERROR,
          BusMessageScopeEnum.SALESFORCE,
        );
      }
    } catch (error) {
      this.integrationLogs.processingMessageError(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Event,
        error,
        event,
      );

      await this.commonIntegrationService.saveEvent(
        event,
        BusMessageStatusEnum.ERROR,
        BusMessageScopeEnum.SALESFORCE,
        error,
      );
    }

    const delta = dateFns.differenceInMilliseconds(new Date(), start);
    this.integrationLogs.processingTime(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      LogMessageType.Event,
      delta,
    );
  };

  private onError = async ({error}: ProcessErrorArgs) => {
    let match;
    if ((match = error.message?.match(/The messaging entity (.*) could not be found./))) {
      this.integrationLogs.connectionProblem(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Event,
        match[1],
        error,
      );
    } else {
      this.integrationLogs.unhandledError(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Event,
        error,
      );
    }
  };
}
