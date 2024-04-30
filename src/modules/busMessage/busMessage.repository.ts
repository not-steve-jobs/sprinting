import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {InfoSystemCommandParameters} from '../integrations/infoSystem/infoSystemIntegrationTypes';
import {BusMessage} from './busMessage.entity';
import {BusMessageTypeEnum} from './busMessage.enum';

@EntityRepository(BusMessage)
export class BusMessageRepository extends AbstractRepository<BusMessage> {
  private q(): SelectQueryBuilder<BusMessage> {
    return this.createQueryBuilder('BusMessage');
  }

  public async findAll(): Promise<BusMessage[]> {
    return this.q().getMany();
  }

  public async findAllByMessageNameAndStatus(messageName: string, status: string, type: string): Promise<BusMessage[]> {
    const query = this.q()
      .andWhere('"messageName" = :messageName', {messageName})
      .andWhere('"status" = :status', {status});
    type ?? query.andWhere('"type" = :type', {type});

    return query.getMany();
  }

  public async findOneByMessageSent(
    messageName: string,
    messageId: string,
    type: BusMessageTypeEnum,
  ): Promise<BusMessage> {
    return this.manager.findOne(BusMessage, {where: {messageName, messageId, type}});
  }

  public async findOneByMessageNameAndPayload(
    messageName: string,
    payload: Partial<InfoSystemCommandParameters>,
  ): Promise<BusMessage> {
    return this.q()
      .where('"messageName" = :messageName', {messageName})
      .andWhere('payload ::jsonb @> :payload', {payload: {body: {parameters: payload}}})
      .getOne();
  }

  public async findOneByMessageIdAndType(messageId: string, type: string): Promise<BusMessage> {
    return this.q().andWhere('"messageId" = :messageId', {messageId}).andWhere('"type" = :type', {type}).getOne();
  }

  public async save(entity: BusMessage) {
    return this.manager.save(entity);
  }

  public async delete(entity: BusMessage) {
    return this.manager.remove(entity);
  }
}
