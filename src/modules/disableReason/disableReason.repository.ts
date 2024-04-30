import {AbstractRepository, EntityRepository} from 'typeorm';
import {DisableReason} from './disableReason.entity';

@EntityRepository(DisableReason)
export class DisableReasonRepository extends AbstractRepository<DisableReason> {
  public async find(): Promise<DisableReason[]> {
    return this.manager.find(DisableReason);
  }

  public async findOne(id: number): Promise<DisableReason> {
    return this.manager.findOne(DisableReason, {
      where: {
        id,
      },
    });
  }

  public async findOneByReason(reason: string): Promise<DisableReason> {
    return this.manager.findOne(DisableReason, {
      where: {
        reason,
      },
    });
  }

  public async save(entity: DisableReason) {
    return this.manager.save(entity);
  }

  public async delete(entity: DisableReason) {
    return this.manager.remove(entity);
  }
}
