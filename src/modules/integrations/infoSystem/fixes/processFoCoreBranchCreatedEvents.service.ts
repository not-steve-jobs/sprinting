import * as dateFns from 'date-fns';
import {BusMessageStatusEnum, BusMessageTypeEnum} from '../../../busMessage/busMessage.enum';
import {BusMessage} from '../../../busMessage/busMessage.entity';
import {BusMessageService} from '../../../busMessage/busMessage.service';
import {CommonIntegrationService} from '../../commonIntegration.service';
import {InfoSystemEvent} from '../eventModels';
import {InfoSystemEventsService} from '../infoSystemEvents.service';
import {Injectable} from '@nestjs/common';
import {IntegrationLogs} from '../../integrationLogging.service';
import {IntegrationSystemLogType, LogMessageType, ProcessingPlace} from '../../integrationSystem.enum';

@Injectable()
export class ProcessFoCoreBranchCreatedService {
  constructor(
    private readonly busMessageService: BusMessageService,
    private readonly infoSystemEventsService: InfoSystemEventsService,
    private readonly commonIntegrationService: CommonIntegrationService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  fixedBy: string;

  public async processEventFix(messageName: string) {
    let busMessages = await this.busMessageService.getAllByMessageNameAndStatus(
      messageName,
      BusMessageStatusEnum.ERROR,
      BusMessageTypeEnum.EVENT,
    );

    busMessages = busMessages
      .filter((message) => message?.payload?.country === 'AF')
      .map((message) => ({
        ...message,
        payload: {...message.payload, brand: 'FOCORE', country: 'FC'},
      }));

    this.integrationLogs.generalInfoLog(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      LogMessageType.Fix,
      ProcessingPlace.FixHandler,
      `BusMessages for processing: ${busMessages.length}`,
    );

    await this.onFix(messageName, busMessages);
  }

  private onFix = async (messageName: string, busMessages: BusMessage[]) => {
    const start = new Date();

    busMessages.forEach(async (busMessage) => {
      const {id, payload} = busMessage;
      const busMessageAttempt = await this.commonIntegrationService.saveEventAttempt(id);
      this.integrationLogs.logMessage(
        __filename,
        IntegrationSystemLogType.InfoSystemIntegration,
        LogMessageType.Fix,
        busMessage,
      );
      try {
        if (this.infoSystemEventsService.mapping.has(messageName)) {
          await this.infoSystemEventsService.mapping.get(messageName)(payload as InfoSystemEvent);
          await this.commonIntegrationService.updateEventAttempt(
            busMessageAttempt.id,
            BusMessageStatusEnum.RECEIVED,
            this.fixedBy,
          );
          await this.commonIntegrationService.updateEvent(payload, BusMessageStatusEnum.FIXED, null, this.fixedBy);
        } else {
          this.integrationLogs.noHandler(
            __filename,
            IntegrationSystemLogType.InfoSystemIntegration,
            LogMessageType.Fix,
            payload.eventName,
          );
          await this.commonIntegrationService.updateEventAttempt(
            busMessageAttempt.id,
            BusMessageStatusEnum.ERROR,
            this.fixedBy,
            "handler doesn't exists",
          );
        }
      } catch (error) {
        this.integrationLogs.processingMessageError(
          __filename,
          IntegrationSystemLogType.InfoSystemIntegration,
          LogMessageType.Fix,
          error,
        );
        await this.commonIntegrationService.updateEventAttempt(
          busMessageAttempt.id,
          BusMessageStatusEnum.ERROR,
          this.fixedBy,
          error,
        );
      }
    });

    const delta = dateFns.differenceInMilliseconds(new Date(), start);
    this.integrationLogs.processingTime(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      LogMessageType.Fix,
      delta,
    );
  };
}
