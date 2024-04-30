import {JobOrderAssociateCaseRepository} from './jobOrderAssociateCase.repository';
import {Injectable} from '@nestjs/common';
import {JobOrderAssociateCase} from './jobOrderAssociateCase.entity';
import {CreateJobOrderAssociateCaseDto} from './dto/createJobOrderAssociateCase.dto';

@Injectable()
export class JobOrderAssociateCaseService {
  public constructor(private readonly jobOrderAssociateCaseRepository: JobOrderAssociateCaseRepository) {}

  public async create(createJobOrderAssociateCaseDto: CreateJobOrderAssociateCaseDto): Promise<JobOrderAssociateCase> {
    const caseToCreate = new JobOrderAssociateCase({...createJobOrderAssociateCaseDto});
    return this.jobOrderAssociateCaseRepository.save(caseToCreate);
  }

  public async findOneByUserAndCase(tenantId: number, userId: string, caseId: string): Promise<JobOrderAssociateCase> {
    return this.jobOrderAssociateCaseRepository.findOneByUserAndCase(tenantId, userId, caseId);
  }
}
