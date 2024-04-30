import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {CaseFollower} from './caseFollower.entity';
import {NotificationEntityName, NotificationTypeEnum} from '../notification/notification.enum';

@EntityRepository(CaseFollower)
export class CaseFollowerRepository extends AbstractRepository<CaseFollower> {
  private q(): SelectQueryBuilder<CaseFollower> {
    return this.createQueryBuilder('CaseFollower');
  }

  public async findByCaseId(caseId: string): Promise<CaseFollower[]> {
    return this.q()
      .andWhere('"CaseFollower"."caseId" = :caseId', {caseId})
      .leftJoinAndSelect('CaseFollower.tenantUser', 'TenantUser')
      .leftJoinAndSelect('TenantUser.user', 'User')
      .leftJoinAndSelect(
        'TenantUser.notifications',
        'Notifications',
        'Notifications.entityId = :entityId AND Notifications.entityName = :entityName AND Notifications.type = :type',
        {
          entityId: caseId,
          entityName: NotificationEntityName.Case,
          type: NotificationTypeEnum.NewCaseMessage,
        },
      )
      .getMany();
  }

  public async findOneByTenantIdAndUserIdAndCaseId(
    tenantId: number,
    userId: string,
    caseId: string,
  ): Promise<CaseFollower> {
    return this.q()
      .andWhere('"CaseFollower"."caseId" = :caseId', {caseId})
      .andWhere('"CaseFollower"."tenantId" = :tenantId', {tenantId})
      .andWhere('"CaseFollower"."userId" = :userId', {userId})
      .leftJoinAndSelect('CaseFollower.tenantUser', 'TenantUser')
      .leftJoinAndSelect(
        'TenantUser.notifications',
        'Notifications',
        'Notifications.entityId = :entityId AND Notifications.entityName = :entityName AND Notifications.type = :type',
        {
          entityId: caseId,
          entityName: NotificationEntityName.Case,
          type: NotificationTypeEnum.NewCaseMessage,
        },
      )
      .getOne();
  }

  public async save(entity: CaseFollower) {
    return this.manager.save(entity);
  }

  public async saveMany(entity: CaseFollower[]) {
    return this.manager.save(entity);
  }

  public async deleteMany(entity: CaseFollower[]) {
    return this.manager.remove(entity);
  }

  public async delete(entity: CaseFollower) {
    return this.manager.remove(entity);
  }
}
