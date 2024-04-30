import {Injectable} from '@nestjs/common';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {JobRole} from './jobRole.entity';
import {JobRolePaginateDto} from './dto/jobRolePaginate.dto';
import {Pagination} from '../common/paginate';

@Injectable()
@EntityRepository(JobRole)
export class JobRoleRepository extends AbstractRepository<JobRole> {
  private q(tenantId: number): SelectQueryBuilder<JobRole> {
    return this.createQueryBuilder('JobRole').where('"JobRole"."tenantId" = :tenantId', {tenantId});
  }

  public async findAll(tenantId?: number): Promise<JobRole[]> {
    if (tenantId) {
      return this.q(tenantId).getMany();
    }

    return this.manager.find(JobRole);
  }

  public async findOne(tenantId: number, id: string): Promise<JobRole> {
    return this.q(tenantId).andWhere('"id" = :id', {id}).getOne();
  }

  public async findOneByName(tenantId: number, name: string): Promise<JobRole> {
    return this.q(tenantId).andWhere('"name" = :name', {name}).getOne();
  }

  public async findOneBySkillCode(tenantId: number, infoSkillCode: string): Promise<JobRole> {
    return this.q(tenantId).andWhere('"infoSkillCode" = :infoSkillCode', {infoSkillCode}).getOne();
  }

  public async deleteRoles(tenantId: number, jobRoleIds: string[]): Promise<any> {
    return jobRoleIds ? this.q(tenantId).andWhere('"id" IN (:...jobRoleIds)', {jobRoleIds}).delete().execute() : '';
  }

  public async save(entity: JobRole) {
    return this.manager.save(entity);
  }

  public async findAllPaginated(tenantId: number, paginatorOptions: JobRolePaginateDto): Promise<Pagination<JobRole>> {
    const [results, total] = await this.q(tenantId)
      .take(paginatorOptions.itemsPerPage)
      .skip((paginatorOptions.page - 1) * paginatorOptions.itemsPerPage)
      .getManyAndCount();
    return new Pagination<JobRole>({
      results,
      total,
    });
  }
}
