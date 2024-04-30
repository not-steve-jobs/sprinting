import {AbstractRepository, EntityRepository} from 'typeorm';
import {JobOrderCertification} from './jobOrderCertification.entity';

@EntityRepository(JobOrderCertification)
export class JobOrderCertificationRepository extends AbstractRepository<JobOrderCertification> {
  public async save(entity: JobOrderCertification) {
    return this.manager.save(entity);
  }

  public async deleteAllCertifications(tenantId: number, jobOrderId: string) {
    return this.createQueryBuilder('JobOrderCertification')
      .where('jobOrderId = :jobOrderId', {jobOrderId})
      .andWhere('tenantId = :tenantId', {tenantId})
      .delete()
      .execute();
  }

  public async deleteAllJobOrdersCertifications(tenantId: number, jobOrderIds: string[]) {
    return jobOrderIds.length
      ? this.createQueryBuilder('JobOrderCertification')
          .where('jobOrderId IN (:...jobOrderIds)', {jobOrderIds})
          .andWhere('tenantId = :tenantId', {tenantId})
          .delete()
          .execute()
      : '';
  }

  public async findByJobOrderId(tenantId: number, jobOrderId: string): Promise<JobOrderCertification[]> {
    return this.manager.find(JobOrderCertification, {where: {tenantId, jobOrderId}});
  }

  public async findOne(tenantId: number, jobOrderId: string, certificationId: string) {
    return this.manager.findOne(JobOrderCertification, {where: {tenantId, jobOrderId, certificationId}});
  }

  public async delete(entity: JobOrderCertification) {
    return this.manager.remove(entity);
  }
}
