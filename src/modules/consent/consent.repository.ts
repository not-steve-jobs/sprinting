import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Consent} from './consent.entity';

@EntityRepository(Consent)
export class ConsentRepository extends AbstractRepository<Consent> {
  private q(tenantId: number): SelectQueryBuilder<Consent> {
    return this.createQueryBuilder('Consent').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findAll(tenantId: number): Promise<Consent[]> {
    return this.q(tenantId).getMany();
  }

  public async findOne(tenantId: number, id: string): Promise<Consent> {
    return this.manager.findOne(Consent, {
      where: {
        tenantId,
        id,
      },
    });
  }

  public async findLastByType(tenantId: number, type: string, isMandatory: boolean): Promise<Consent> {
    return this.manager.findOne(Consent, {
      where: {
        tenantId,
        type,
        isMandatory,
      },
      order: {
        validFrom: 'DESC',
      },
    });
  }

  public async save(entity: Consent) {
    return this.manager.save(entity);
  }

  public async delete(entity: Consent) {
    return this.manager.remove(entity);
  }
}
