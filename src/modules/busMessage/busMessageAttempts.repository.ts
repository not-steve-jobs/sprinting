import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {BusMessageAttempts} from './busMessageAttempts.entity';

@EntityRepository(BusMessageAttempts)
export class BusMessageAttemptsRepository extends AbstractRepository<BusMessageAttempts> {
  private q(): SelectQueryBuilder<BusMessageAttempts> {
    return this.createQueryBuilder('BusMessageAttempts');
  }

  public async findOne(id: string): Promise<BusMessageAttempts> {
    return this.manager.findOne(BusMessageAttempts, {where: {id}});
  }

  public async findAttemptsByBusMessage(busMessageId: string): Promise<BusMessageAttempts[]> {
    return this.manager.find(BusMessageAttempts, {where: {busMessageId}});
  }

  public async save(entity: BusMessageAttempts) {
    return this.manager.save(entity);
  }

  public async delete(entity: BusMessageAttempts) {
    return this.manager.remove(entity);
  }
}
