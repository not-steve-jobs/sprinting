import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {NetPromoteScore} from './netPromoteScore.entity';

@EntityRepository(NetPromoteScore)
export class NetPromoteScoreRepository extends AbstractRepository<NetPromoteScore> {
  private q(tenantId: number): SelectQueryBuilder<NetPromoteScore> {
    return this.createQueryBuilder('NetPromoteScore').where('"tenantId" = :tenantId', {tenantId});
  }

  public async save(entity: NetPromoteScore) {
    return this.manager.save(entity);
  }
}
