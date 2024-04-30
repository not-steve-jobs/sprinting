import {Injectable} from '@nestjs/common';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {JobRoleTemplate} from './jobRoleTemplate.entity';

@Injectable()
@EntityRepository(JobRoleTemplate)
export class JobRoleTemplateRepository extends AbstractRepository<JobRoleTemplate> {
  private q(tenantId: number): SelectQueryBuilder<JobRoleTemplate> {
    return this.createQueryBuilder('JobRoleTemplate').where('"JobRoleTemplate"."tenantId" = :tenantId', {tenantId});
  }

  public async findAll(tenantId: number): Promise<JobRoleTemplate[]> {
    return this.q(tenantId).getMany();
  }

  public async findOne(tenantId: number, id: string): Promise<JobRoleTemplate> {
    return this.q(tenantId).andWhere('"id" = :id', {id}).getOne();
  }

  public async findAllByJobRole(tenantId: number, jobRoleId: string): Promise<JobRoleTemplate[]> {
    return this.q(tenantId).andWhere('"jobRoleId" = :jobRoleId', {jobRoleId}).getMany();
  }

  public async findOneByJobRole(tenantId: number, jobRoleId: string): Promise<JobRoleTemplate> {
    return this.q(tenantId).andWhere('"jobRoleId" = :jobRoleId', {jobRoleId}).getOne();
  }

  public async findOneByJobRoleAndLanguage(
    tenantId: number,
    jobRoleId: string,
    languageId: string,
  ): Promise<JobRoleTemplate> {
    return this.q(tenantId)
      .andWhere('"jobRoleId" = :jobRoleId', {jobRoleId})
      .andWhere('"languageId" = :languageId', {languageId})
      .getOne();
  }

  public async save(entity: JobRoleTemplate) {
    return this.manager.save(entity);
  }

  public async deleteTemplatesForRoles(tenantId: number, jobRoleIds: string[]) {
    return jobRoleIds.length
      ? this.q(tenantId).andWhere('jobRoleId IN (:...jobRoleIds)', {jobRoleIds}).delete().execute()
      : '';
  }
}
