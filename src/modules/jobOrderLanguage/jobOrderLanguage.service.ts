import {JobOrderLanguage} from './jobOrderLanguage.entity';
import {JobOrderLanguageRepository} from './jobOrderLanguage.repository';
import {Injectable} from '@nestjs/common';

@Injectable()
export class JobOrderLanguageService {
  constructor(private readonly jobOrderLanguageRepository: JobOrderLanguageRepository) {}

  public async findOne(tenantId: number, jobOrderId: string, languageId: string): Promise<JobOrderLanguage> {
    return this.jobOrderLanguageRepository.findOne(tenantId, jobOrderId, languageId);
  }

  public async create(jobOrderLanguage: JobOrderLanguage): Promise<JobOrderLanguage> {
    return this.jobOrderLanguageRepository.save(jobOrderLanguage);
  }

  public async delete(jobOrderLanguage: JobOrderLanguage): Promise<JobOrderLanguage> {
    return this.jobOrderLanguageRepository.delete(jobOrderLanguage);
  }
}
