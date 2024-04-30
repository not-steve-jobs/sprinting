import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Country} from './country.entity';

@EntityRepository(Country)
export class CountryRepository extends AbstractRepository<Country> {
  private q(): SelectQueryBuilder<Country> {
    return this.createQueryBuilder('Country');
  }

  public async findAll(): Promise<Country[]> {
    return this.q().getMany();
  }

  public async findOne(id: string): Promise<Country> {
    return this.q().where('"id" = :id', {id}).getOne();
  }

  public async findOneByCode(code: string): Promise<Country> {
    return this.q().where('LOWER("code") = LOWER(:code)', {code}).getOne();
  }

  public async findOneByName(name: string): Promise<Country> {
    return this.q().where('LOWER("name") = LOWER(:name)', {name}).getOne();
  }

  public async findOneByCallingCode(callingCode: string): Promise<Country> {
    return this.q().where('"callingCode" = :callingCode', {callingCode}).getOne();
  }

  public async save(entity: Country) {
    return this.manager.save(entity);
  }

  public async delete(entity: Country) {
    return this.manager.remove(entity);
  }
}
