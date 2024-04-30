import {IntegrationSystemLogType, LogMessageType} from './../../integrationSystem.enum';
import {IntegrationLogs} from './../../integrationLogging.service';
import * as dateFns from 'date-fns';
import {Injectable} from '@nestjs/common';
import {BusMessageStatusEnum, BusMessageTypeEnum} from '../../../busMessage/busMessage.enum';
import {BusMessageService} from '../../../busMessage/busMessage.service';
import {InfoSystemEvent} from '../eventModels';
import {InfoSystemEventsService} from '../infoSystemEvents.service';
import {BusMessage} from '../../../busMessage/busMessage.entity';
import {CommonIntegrationService} from '../../commonIntegration.service';

@Injectable()
export class ProcessEventFixesService {
  constructor(
    private readonly busMessageService: BusMessageService,
    private readonly infoSystemEventsService: InfoSystemEventsService,
    private readonly commonIntegrationService: CommonIntegrationService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  fixedBy: string;

  public async processEventFixByMessageName(messageName: string) {
    const busMessages = await this.busMessageService.getAllByMessageNameAndStatus(
      messageName,
      BusMessageStatusEnum.ERROR,
      BusMessageTypeEnum.EVENT,
    );
    await this.onFix(messageName, busMessages);
  }

  private onFix = async (messageName: string, busMessages: BusMessage[]) => {
    const start = new Date();

    Object.values(busMessages).forEach(async (busMessage) => {
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
