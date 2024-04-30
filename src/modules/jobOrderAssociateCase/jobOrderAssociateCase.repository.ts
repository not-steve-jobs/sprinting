import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {JobOrderAssociateCase} from './jobOrderAssociateCase.entity';

@EntityRepository(JobOrderAssociateCase)
export class JobOrderAssociateCaseRepository extends AbstractRepository<JobOrderAssociateCase> {
  private q(tenantId: number): SelectQueryBuilder<JobOrderAssociateCase> {
    return this.createQueryBuilder('JobOrderAssociateCase').where('"JobOrderAssociateCase"."tenantId" = :tenantId', {
      tenantId,
    });
  }

  public async save(entity: JobOrderAssociateCase) {
    return this.manager.save(entity);
  }

  public async deleteCasesForJobOrders(tenantId: number, jobOrderIds: string[]) {
    return jobOrderIds.length
      ? this.q(tenantId).andWhere('jobOrderId IN (:...jobOrderIds)', {jobOrderIds}).delete().execute()
      : '';
  }

  public async findOneByUserAndCase(tenantId: number, userId: string, caseId: string): Promise<JobOrderAssociateCase> {
    return this.q(tenantId).andWhere('"userId" = :userId', {userId}).andWhere('"caseId" = :caseId', {caseId}).getOne();
  }
}
