import {Injectable} from '@nestjs/common';
import {BusMessage} from '../../../busMessage/busMessage.entity';
import {BusMessageStatusEnum, BusMessageTypeEnum} from '../../../busMessage/busMessage.enum';
import {BusMessageService} from '../../../busMessage/busMessage.service';
import {InfoSystemCommandsService} from '../infoSystemCommands.service';

@Injectable()
export class ProcessCommandFixesService {
  constructor(
    private readonly busMessageService: BusMessageService,
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
  ) {}

  fixedBy: string;

  public async processCommandFixByMessageName(messageName: string) {
    const busMessages = await this.busMessageService.getAllByMessageNameAndStatus(
      messageName,
      BusMessageStatusEnum.ERROR,
      BusMessageTypeEnum.COMMAND,
    );

    await this.onFix(busMessages);
  }

  private onFix = async (busMessages: BusMessage[]) => {
    Object.values(busMessages).forEach(async (busMessage) => {
      const {id, payload} = busMessage;
      await this.infoSystemCommandsService.execute(payload.body, payload.userProperties, id, this.fixedBy);
    });
  };
}
