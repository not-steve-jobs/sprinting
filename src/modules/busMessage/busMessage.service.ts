import {CreateBusMessageDto} from './dto/createBusMessage.dto';
import {Injectable} from '@nestjs/common';
import {BusMessage} from './busMessage.entity';
import {BusMessageRepository} from './busMessage.repository';
import {UpdateBusMessageDto} from './dto/updateBusMessage.dto';
import {BusMessageStatusEnum, BusMessageTypeEnum} from './busMessage.enum';
import {BusMessageError} from './busMessage.error';
import {CreateBusMessageAttemptDto} from './dto/createBusMessageAttempt.dto';
import {BusMessageAttempts} from './busMessageAttempts.entity';
import {BusMessageAttemptsRepository} from './busMessageAttempts.repository';
import {UpdateBusMessageAttemptDto} from './dto/updateBusMessageAttempt.dto';

@Injectable()
export class BusMessageService {
  constructor(
    private readonly busMessageRepository: BusMessageRepository,
    private readonly busMessageAttemptsRepository: BusMessageAttemptsRepository,
  ) {}

  public async getAll(): Promise<BusMessage[]> {
    return this.busMessageRepository.findAll();
  }

  public async getAllByMessageNameAndStatus(
    messageName: string,
    status: BusMessageStatusEnum,
    type: BusMessageTypeEnum = null,
  ): Promise<BusMessage[]> {
    return await this.busMessageRepository.findAllByMessageNameAndStatus(messageName, status, type);
  }

  public async findOneByMessageSent(
    messageName: string,
    messageId: string,
    type: BusMessageTypeEnum,
  ): Promise<BusMessage> {
    return this.busMessageRepository.findOneByMessageSent(messageName, messageId, type);
  }

  public async create(busMessageData: CreateBusMessageDto): Promise<BusMessage> {
    try {
      const busMessage = new BusMessage(busMessageData);

      return await this.busMessageRepository.save(busMessage);
    } catch (error) {
      throw new BusMessageError.BusMessageCreateError(null, error);
    }
  }

  public async update(busMessageData: UpdateBusMessageDto): Promise<BusMessage> {
    const busMessage = await this.findOneByMessageSent(
      busMessageData.messageName,
      busMessageData.messageId,
      busMessageData.type,
    );

    if (busMessage) {
      busMessage.response = busMessageData.payload ?? busMessage.response;
      busMessage.status = busMessageData.status ?? busMessage.status;
      busMessage.internalError = busMessageData.internalError ?? busMessage.internalError;
      busMessage.fixedBy = busMessageData.fixedBy ?? busMessage.fixedBy;

      return await this.busMessageRepository.save(busMessage);
    }

    return null;
  }

  public async createAttempt(busMessageAttemptData: CreateBusMessageAttemptDto): Promise<BusMessageAttempts> {
    try {
      const busMessageAttempt = new BusMessageAttempts(busMessageAttemptData);

      return await this.busMessageAttemptsRepository.save(busMessageAttempt);
    } catch (error) {
      throw new BusMessageError.BusMessageCreateError(null, error);
    }
  }

  public async updateAttempt(
    busMessageAttemptId: string,
    busMessageAttemptData: UpdateBusMessageAttemptDto,
  ): Promise<BusMessageAttempts> {
    const busMessageAttempt = await this.busMessageAttemptsRepository.findOne(busMessageAttemptId);

    if (busMessageAttempt) {
      busMessageAttempt.status = busMessageAttemptData.status ?? busMessageAttempt.status;
      busMessageAttempt.internalError = busMessageAttemptData.internalError ?? busMessageAttempt.internalError;
      busMessageAttempt.fixedBy = busMessageAttemptData.fixedBy;

      return await this.busMessageAttemptsRepository.save(busMessageAttempt);
    }

    return null;
  }

  public async getAttemptsCount(busMessageId: string): Promise<number> {
    const attempts = await this.busMessageAttemptsRepository.findAttemptsByBusMessage(busMessageId);
    return attempts.length;
  }
}
