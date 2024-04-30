import {RateListDto} from './dto/rateList.dto';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Rate} from './rate.entity';

@EntityRepository(Rate)
export class RateRepository extends AbstractRepository<Rate> {
  private q(tenantId: number): SelectQueryBuilder<Rate> {
    return this.createQueryBuilder('Rate').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findAll(): Promise<Rate[]> {
    return this.manager.find(Rate);
  }

  public async findOne(id: number, tenantId: number): Promise<Rate> {
    return this.manager.findOne(Rate, {where: {id, tenantId}});
  }

  public async save(entity: Rate) {
    return this.manager.save(entity);
  }

  public async getTenantRates(tenantId: number): Promise<RateListDto[]> {
    return this.q(tenantId).select(['Rate.name', 'Rate.id', 'Rate.keyName']).orderBy('id', 'ASC').getMany();
  }
}
