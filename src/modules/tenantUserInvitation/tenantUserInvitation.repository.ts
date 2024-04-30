import {Injectable} from '@nestjs/common';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {TenantUserInvitation} from './tenantUserInvitation.entity';
import {TenantUser} from '../tenantUser/tenantUser.entity';

@Injectable()
@EntityRepository(TenantUserInvitation)
export class TenantUserInvitationRepository extends AbstractRepository<TenantUserInvitation> {
  private q(tenantId: number, userId: string): SelectQueryBuilder<TenantUserInvitation> {
    return this.createQueryBuilder('TenantUserInvitation')
      .where('"TenantUserInvitation"."tenantId" = :tenantId', {tenantId})
      .andWhere('"TenantUserInvitation"."userId" = :userId', {userId});
  }

  public async findOne(id: string): Promise<TenantUserInvitation> {
    return this.createQueryBuilder('TenantUserInvitation').andWhere('"TenantUserInvitation"."id" = :id', {id}).getOne();
  }

  public async findOneIfActive(tenantId: number, id: string): Promise<TenantUserInvitation> {
    const isActive = true;
    return this.createQueryBuilder('TenantUserInvitation')
      .andWhere('"TenantUserInvitation"."id" = :id', {id})
      .andWhere('"TenantUserInvitation"."tenantId" = :tenantId', {tenantId})
      .andWhere('"TenantUserInvitation"."isActive" = :isActive', {isActive})
      .leftJoinAndSelect('TenantUserInvitation.tenantUser', 'TenantUser')
      .leftJoinAndSelect('TenantUser.user', 'User')
      .getOne();
  }

  public async findLastOne(tenantId: number, userId: string): Promise<TenantUserInvitation> {
    return this.q(tenantId, userId).orderBy('"TenantUserInvitation"."dateExpiry"', 'DESC').getOne();
  }

  public async findLastOneByEmail(tenantId: number, userId: string, email: string): Promise<TenantUserInvitation> {
    return this.q(tenantId, userId).andWhere('"email" = :email', {email}).orderBy('"dateExpiry"', 'DESC').getOne();
  }

  public async save(entity: TenantUserInvitation) {
    return this.manager.save(entity);
  }

  public async saveBulk(entities: TenantUserInvitation[]) {
    return this.manager.save(entities);
  }

  public async delete(entity: TenantUserInvitation) {
    return this.manager.remove(entity);
  }

  public async getExpiredInvitations(
    currentDate: Date,
    statusId: number,
    isActive = true,
  ): Promise<TenantUserInvitation[]> {
    return this.createQueryBuilder('TenantUserInvitation')
      .leftJoinAndSelect(
        TenantUser,
        'tenantUser',
        'tenantUser.userId = TenantUserInvitation.userId AND tenantUser.tenantId = TenantUserInvitation.tenantId',
      )
      .andWhere('"TenantUserInvitation"."dateExpiry" < :currentDate', {currentDate})
      .andWhere('tenantUser.statusId = :statusId', {statusId})
      .andWhere('TenantUserInvitation.isActive = :isActive', {isActive})
      .getMany();
  }
}
