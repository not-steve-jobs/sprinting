import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {UserConsent} from './userConsent.entity';
import {User} from '../user/user.entity';
import {Consent} from '../consent/consent.entity';

@EntityRepository(UserConsent)
export class UserConsentRepository extends AbstractRepository<UserConsent> {
  private q(userId: string): SelectQueryBuilder<UserConsent> {
    return this.createQueryBuilder('UserConsent').where('"UserConsent"."userId" = :userId', {userId});
  }

  public async findOne(userId: string): Promise<UserConsent> {
    return this.q(userId).getOne();
  }

  public async findOneById(userId: string, consentId: number, id: string): Promise<UserConsent> {
    return this.q(userId)
      .andWhere('"UserConsent"."consentId" = :consentId', {consentId})
      .andWhere('"UserConsent"."id" = :id', {id})
      .getOne();
  }

  public async getAll(userId: string): Promise<UserConsent[]> {
    return this.q(userId).getMany();
  }

  public async getAllWithConsent(userId: string): Promise<UserConsent[]> {
    return this.q(userId)
      .leftJoinAndMapOne('UserConsent.consent', Consent, 'Consent', 'Consent.id = UserConsent.consentId')
      .getMany();
  }

  public async findOneWithUser(userId: string): Promise<UserConsent> {
    return this.q(userId).leftJoinAndMapOne('UserConsent.user', User, 'User', 'User.id=UserConsent.userId').getOne();
  }

  public async findLastOne(tenantId: number, userId: string, type: string): Promise<UserConsent> {
    return this.q(userId)
      .andWhere('"UserConsent"."tenantId" = :tenantId', {tenantId})
      .leftJoinAndMapOne('UserConsent.consent', Consent, 'Consent', 'Consent.id = UserConsent.consentId')
      .andWhere('"Consent"."type" = :type', {type})
      .orderBy('"UserConsent"."createdAt"', 'DESC')
      .getOne();
  }

  public async findAll(userId: string): Promise<UserConsent[]> {
    return this.q(userId).getMany();
  }

  public async save(entity: UserConsent) {
    return this.manager.save(entity);
  }

  public async delete(entity: UserConsent) {
    return this.manager.remove(entity);
  }
}
