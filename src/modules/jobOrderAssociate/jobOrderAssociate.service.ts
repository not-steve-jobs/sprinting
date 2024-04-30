import {CandidatesFilterDataDto} from './dto/candidatesFilterData.dto';
import {StatusService} from './../status/status.service';
import {JobOrderAssociate} from 'src/modules/jobOrderAssociate/jobOrderAssociate.entity';
import {JobOrderAssociateRepository} from './jobOrderAssociate.repository';
import {Injectable} from '@nestjs/common';
import {SharedErrors} from 'src/core/error/shared.error';
import {JobOrderService} from '../jobOrder/jobOrder.service';
import {TenantRepository} from '../tenant/tenant.repository';
import {InfoSystemCommandsService} from '../integrations/infoSystem/infoSystemCommands.service';
import {JobOrderAssociateStatus} from '../status/status.enum';
import {getConnection} from 'typeorm';
import {JobOrderRepository} from '../jobOrder/jobOrder.repository';
import {CandidateCacheService} from 'src/appCache/candidateCache.service';
import {SalesForceCommandsService} from '../integrations/salesForce/salesForceCommands.service';

@Injectable()
export class JobOrderAssociateService {
  public constructor(
    private readonly jobOrderAssociateRepository: JobOrderAssociateRepository,
    private readonly jobOrderRepository: JobOrderRepository,
    private readonly statusService: StatusService,
    private readonly jobOrderService: JobOrderService,
    private readonly tenantRepository: TenantRepository,
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
    private readonly salesForceCommandsService: SalesForceCommandsService,
    private readonly candidateCache: CandidateCacheService,
  ) {}

  public async changeCandidateStatus(
    tenantId: number,
    jobOrderId: string,
    candidateId: string,
    statusName: string,
  ): Promise<JobOrderAssociate> {
    const jobOrderAssociate = await this.jobOrderAssociateRepository.findOne(jobOrderId, tenantId, candidateId);
    if (!jobOrderAssociate) {
      throw new SharedErrors.EntityNotFoundError({
        name: 'JobOrderAssociate',
        jobOrderId,
        tenantId,
        candidateId,
      });
    }

    const status = await this.statusService.getStatusByName(tenantId, statusName, JobOrderAssociate.name);
    if (!status) {
      throw new SharedErrors.EntityNotFoundError({name: 'Status', statusName});
    }

    jobOrderAssociate.statusId = status.id;

    if (statusName === JobOrderAssociateStatus.Submittal) {
      jobOrderAssociate.movedBackFromSelect = true;
    }

    let createdAssociate;
    const statuses = await this.jobOrderService.getJobOrderRelatedStatuses(tenantId);
    await getConnection().transaction(async (tManager) => {
      const jobOrderAssociateRepository = tManager.getCustomRepository(JobOrderAssociateRepository);
      createdAssociate = await jobOrderAssociateRepository.save(
        new JobOrderAssociate({
          tenantId: jobOrderAssociate.tenantId,
          userId: jobOrderAssociate.userId,
          statusId: jobOrderAssociate.statusId,
          movedBackFromSelect: jobOrderAssociate.movedBackFromSelect,
        }),
      );
      const jobOrderRepository = tManager.getCustomRepository(JobOrderRepository);
      return jobOrderRepository.recalculateJobOrderStatus(tenantId, jobOrderId, statuses, true);
    });

    const tenant = await this.tenantRepository.findOneWithRelations(tenantId);
    const jobOrder = await this.jobOrderRepository.findOne(tenantId, jobOrderId);
    await this.salesForceCommandsService.sendJobUpdated(tenant, jobOrder);
    await this.infoSystemCommandsService.sendJobProcessUpdated(tenant, jobOrderAssociate);
    return createdAssociate;
  }

  public async getCandidatesFilterData(): Promise<CandidatesFilterDataDto> {
    const empty = '-';
    let languages = [];
    const locations = [];
    let educations = [];
    const allCandidates = await this.candidateCache.getAll();

    allCandidates.forEach((candidate) => {
      const {languages: singleCandidateLanguages, city, country, educationType} = candidate;
      languages = [...languages, ...(singleCandidateLanguages ?? []).filter((i) => !languages.includes(i))];
      if (!locations.find((location) => location.city === city && location.country === country)) {
        locations.push({
          city,
          country,
          locationName: `${city ?? empty}, ${country ?? empty}`,
        });
      }
      educations = [...educations, ...(educationType && !educations.includes(educationType) ? [educationType] : [])];
    });

    // added dummy ids (indexes of elements in the array) for FE filter purposes
    return {
      languages: languages.map((language, index) => ({
        id: index + 1,
        name: language,
      })),
      locations: locations.map((location, index) => ({id: index + 1, ...location})),
      educations: educations.map((education, index) => ({id: index + 1, name: education})),
    };
  }
}
