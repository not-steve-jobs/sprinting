import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Currency} from './currency.entity';

@EntityRepository(Currency)
export class CurrencyRepository extends AbstractRepository<Currency> {
  private q(): SelectQueryBuilder<Currency> {
    return this.createQueryBuilder('Currency');
  }

  public async findAll(): Promise<Currency[]> {
    return this.q().getMany();
  }

  public async findOne(id: string): Promise<Currency> {
    return this.q().where('"id" = :id', {id}).getOne();
  }

  public async save(entity: Currency) {
    return this.manager.save(entity);
  }

  public async delete(entity: Currency) {
    return this.manager.remove(entity);
  }
}
