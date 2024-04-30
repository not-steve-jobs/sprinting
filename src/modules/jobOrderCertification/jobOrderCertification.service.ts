import {JobOrderCertification} from './jobOrderCertification.entity';
import {JobOrderCertificationRepository} from './jobOrderCertification.repository';
import {Injectable} from '@nestjs/common';

@Injectable()
export class JobOrderCertificationService {
  constructor(private readonly jobOrderCertificationRepository: JobOrderCertificationRepository) {}

  public async findOne(tenantId: number, jobOrderId: string, certificationId: string): Promise<JobOrderCertification> {
    return this.jobOrderCertificationRepository.findOne(tenantId, jobOrderId, certificationId);
  }

  public async create(jobOrderCertification: JobOrderCertification): Promise<JobOrderCertification> {
    return this.jobOrderCertificationRepository.save(jobOrderCertification);
  }

  public async delete(jobOrderCertification: JobOrderCertification): Promise<JobOrderCertification> {
    return this.jobOrderCertificationRepository.delete(jobOrderCertification);
  }
}
