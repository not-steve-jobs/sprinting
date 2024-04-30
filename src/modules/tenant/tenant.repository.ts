import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Tenant} from './tenant.entity';

@EntityRepository(Tenant)
export class TenantRepository extends AbstractRepository<Tenant> {
  private q(): SelectQueryBuilder<Tenant> {
    return this.createQueryBuilder('Tenant');
  }

  public async findAll(): Promise<Tenant[]> {
    return this.q().getMany();
  }

  public async findOne(id: number): Promise<Tenant> {
    return this.q().where('"id" = :id', {id}).getOne();
  }

  public async findOneWithRelations(id: number): Promise<Tenant> {
    return this.manager.findOne(Tenant, {
      where: {
        id,
      },
      relations: ['country'],
    });
  }

  public async findOneByAliasWithRelations(alias: string): Promise<Tenant> {
    return this.manager.findOne(Tenant, {
      where: {
        alias,
      },
      relations: ['country'],
    });
  }

  public async findOneByAlias(alias: string): Promise<Tenant> {
    return this.q().where({alias}).getOne();
  }

  public async findAllTenantByBrandName(brand: string): Promise<Tenant[]> {
    return this.manager.find(Tenant, {
      where: {
        brand,
      },
      relations: ['country'],
    });
  }

  public async findAllByCountryId(countryId: string): Promise<Tenant[]> {
    return this.manager.find(Tenant, {
      where: {
        countryId,
      },
      relations: ['country'],
    });
  }

  public async findOneByBrandAndCountry(brand: string, countryId: string): Promise<Tenant> {
    return this.q()
      .where({countryId})
      .andWhere('LOWER("brand") = LOWER(:brand)', {brand})
      .leftJoinAndSelect('Tenant.country', 'Country')
      .getOne();
  }

  public findOneByDomain(domain: string): Promise<Tenant> {
    return this.createQueryBuilder('Tenant').where(':domain = ANY(domains)', {domain}).getOne();
  }

  public async exists(id: number): Promise<boolean> {
    const count = await this.q().where('"id" = :id', {id}).getCount();
    return count > 0;
  }

  public async save(entity: Tenant) {
    return this.manager.save(entity);
  }

  public async delete(entity: Tenant) {
    return this.manager.remove(entity);
  }
}
