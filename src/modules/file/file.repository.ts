import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Case} from '../case/case.entity';
import {CaseComment} from '../caseComment/caseComment.entity';
import {JobOrder} from '../jobOrder/jobOrder.entity';
import {File} from './file.entity';

@EntityRepository(File)
export class FileRepository extends AbstractRepository<File> {
  private q(tenantId: number): SelectQueryBuilder<File> {
    return this.createQueryBuilder('File').where('"File"."tenantId" = :tenantId', {tenantId});
  }

  public async findByCaseId(tenantId: number, caseId: string): Promise<[File[], number]> {
    return this.q(tenantId)
      .andWhere('File.entityId = :caseId', {caseId})
      .andWhere('File.entityName = :entityName', {entityName: Case.name})
      .andWhere('File.deletedByUserId is null')
      .leftJoinAndSelect('File.tenantUser', 'TenantUser')
      .leftJoinAndSelect('TenantUser.user', 'User')
      .leftJoinAndSelect('User.userProfile', 'UserProfile')
      .getManyAndCount();
  }

  public async findCaseCommentFilesByCaseId(tenantId: number, caseId: string): Promise<[File[], number]> {
    return this.q(tenantId)
      .andWhere('File.entityName = :entityName', {entityName: CaseComment.name})
      .andWhere(
        `File.entityId IN ( SELECT "id" FROM "CaseComment" WHERE "caseId" = '${caseId}' AND "tenantId" = ${tenantId} )`,
      )
      .andWhere('File.deletedByUserId is null')
      .leftJoinAndSelect('File.tenantUser', 'TenantUser')
      .leftJoinAndSelect('TenantUser.user', 'User')
      .leftJoinAndSelect('User.userProfile', 'UserProfile')
      .getManyAndCount();
  }

  public async findOne(tenantId: number, fileId: string): Promise<File> {
    return this.q(tenantId).andWhere('File.id = :fileId', {fileId}).getOne();
  }

  public async save(entity: File) {
    return this.manager.save(entity);
  }
  public async delete(entity: File) {
    return this.manager.remove(entity);
  }

  public async findByCaseCommentId(tenantId: number, caseCommentId: string): Promise<File[]> {
    const query = this.q(tenantId)
      .andWhere('"File"."entityId" = :caseCommentId', {caseCommentId})
      .andWhere('File.entityName = :entityName', {entityName: CaseComment.name});

    return query.getMany();
  }

  public async findByJobOrderId(tenantId: number, jobOrderId: string, fetchDeletedFiles: boolean): Promise<File[]> {
    let query = this.q(tenantId)
      .andWhere('"File"."entityId" = :jobOrderId', {jobOrderId})
      .andWhere('File.entityName = :entityName', {entityName: JobOrder.name});
    if (!fetchDeletedFiles) {
      query = query.andWhere('"File"."deletedByUserId" IS NULL');
    }

    return query.getMany();
  }

  public async findOneByFilePathAndName(tenantId: number, filePathAndName: string): Promise<File> {
    return this.q(tenantId).andWhere('File.filePathAndName = :filePathAndName', {filePathAndName}).getOne();
  }
}
