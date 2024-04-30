import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {CaseComment} from './caseComment.entity';

@EntityRepository(CaseComment)
export class CaseCommentRepository extends AbstractRepository<CaseComment> {
  private q(): SelectQueryBuilder<CaseComment> {
    return this.createQueryBuilder('CaseComment');
  }

  public async findOneById(tenantId: number, id: string): Promise<CaseComment> {
    return this.q()
      .andWhere('"CaseComment"."id" = :id', {id})
      .andWhere('"CaseComment"."tenantId" = :tenantId', {tenantId})
      .leftJoinAndSelect('CaseComment.tenantUser', 'TenantUser')
      .leftJoinAndSelect('TenantUser.user', 'User')
      .leftJoinAndSelect('User.userProfile', 'UserProfile')
      .getOne();
  }

  public async findOneDraftByCaseIdAndUserId(tenantId: number, userId: string, caseId: string): Promise<CaseComment> {
    return this.q()
      .andWhere('"CaseComment"."tenantId" = :tenantId', {tenantId})
      .andWhere('"CaseComment"."userId" = :userId', {userId})
      .andWhere('"CaseComment"."caseId" = :caseId', {caseId})
      .andWhere('"CaseComment"."isDraft" = :flag', {flag: true})
      .getOne();
  }

  public async findByCaseId(tenantId: number, caseId: string): Promise<CaseComment[]> {
    return this.q()
      .andWhere('"CaseComment"."tenantId" = :tenantId', {tenantId})
      .andWhere('"CaseComment"."caseId" = :caseId', {caseId})
      .andWhere('"CaseComment"."isDraft" = :isDraft', {isDraft: false})
      .leftJoinAndSelect('CaseComment.tenantUser', 'TenantUser')
      .leftJoinAndSelect('TenantUser.user', 'User')
      .leftJoinAndSelect('User.userProfile', 'UserProfile')
      .addOrderBy('CaseComment.createdAt', 'DESC')
      .getMany();
  }

  public async save(entity: CaseComment) {
    return this.manager.save(entity);
  }

  public async delete(entity: CaseComment) {
    return this.manager.remove(entity);
  }

  public async deleteMultiple(caseIds: string[]) {
    return caseIds.length
      ? this.createQueryBuilder('CaseComment').andWhere('caseId IN (:...caseIds)', {caseIds}).delete().execute()
      : '';
  }
}
