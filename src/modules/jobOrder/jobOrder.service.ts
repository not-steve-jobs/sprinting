import * as dateFns from 'date-fns';
import {StatusDto} from './../status/dto/status.dto';
import {CloseReasonService} from 'src/modules/closeReason/closeReason.service';
import {AamBackendService} from './../aamBackend/aamBackend.service';
import {
  JobOrderAssociatesDto,
  JobOrderAssociatesWithAamDataDto,
} from './../jobOrderAssociate/dto/jobOrderAssociates.dto';
import {JobOrderAssociateStatus, JobOrderStatus} from '../status/status.enum';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {getConnection} from 'typeorm';
import {JobOrder} from './jobOrder.entity';
import {JobOrderRepository} from './jobOrder.repository';
import {JobOrderDto} from './dto/jobOrder.dto';
import {UpsertJobOrderDto, UpsertDraftJobOrderDto} from './dto/upsertJobOrder.dto';
import {JobOrderError} from './jobOrder.error';
import {StatusService} from '../status/status.service';
import {SharedErrors} from '../../core/error/shared.error';
import {JobOrderLanguageRepository} from '../jobOrderLanguage/jobOrderLanguage.repository';
import {JobOrderCertificationRepository} from '../jobOrderCertification/jobOrderCertification.repository';
import {JobOrderCertification} from '../jobOrderCertification/jobOrderCertification.entity';
import {PlainObject} from '../common/common.dto';
import {FilteringOptions, Pagination, PaginationOptions, SortingOptions} from '../common/paginate';
import {UserServiceErrors} from '../user/user.error';
import {ExportHelper, GenerateXlsxDto} from '../../helpers/export.helper';
import {JobOrderAssociateRepository} from '../jobOrderAssociate/jobOrderAssociate.repository';
import {JobOrderAssociate} from '../jobOrderAssociate/jobOrderAssociate.entity';
import {InfoSystemCommandsService} from '../integrations/infoSystem/infoSystemCommands.service';
import {FileService} from '../file/file.service';
import {AppConfigService} from '../../core/config/appConfig.service';
import {PersonService} from '../person/person.service';
import {TenantRepository} from '../tenant/tenant.repository';
import {FeatureConfigurationService} from '../featureConfiguration/featureConfiguration.service';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {FeatureConfigurationFeature} from '../featureConfiguration/enum/featureConfigurationFeature.enum';
import {Logger} from 'src/core/logger';
import {CandidateDto} from '../aamBackend/dto/candidate.dto';
import {UrlType} from '../aamBackend/urlType.enum';
import {CloseReasonArgumentsService} from '../closeReasonArguments/closeReasonArguments.service';
import {CloseReasonArgumentsPayload} from '../closeReasonArguments/dto/closeReasonArgumentsPayload.dto';
import {CloseReasonArgumentsDto} from '../closeReasonArguments/dto/closeReasonArguments.dto';
import {JobOrderNotificationsService} from '../jobOrder/jobOrderNotifications.service';
import {GenerateXlsxOptions} from '../../core/generateXlsxOptions.interface';
import {StaffingRequestsXlsxDto, StaffingRequestXlsxDto} from './dto/staffingRequestsXlsx.dto';
import {
  JobOrderDetailsDataXlsxDto,
  JobOrderDetailsXlsxDto,
  OrderDetailsDataXlsxDto,
} from './dto/jobOrderDetailsXlsx.dto';
import {FeatureConfigurationChannel} from '../featureConfiguration/enum/featureConfigurationChannel.enum';
import {UtilsHelper} from '../../helpers/utils.helper';
import {XlsxTemplateNames} from 'src/core/xlsxTemplateNames.enum';
import {JobOrderAssociatesDataXlsxDto} from '../jobOrderAssociate/dto/jobOrderAssociatesXlsx.dto';
import {JobOrderAuditLogService} from './jobOrderAuditLog.service';
import {AuditLogOrigin, AuditLogType} from '../auditLog/auditLog.enum';
import {AuditLog} from '../auditLog/auditLog.entity';
import {CandidateCacheService} from 'src/appCache/candidateCache.service';
import {SimpleJobOrderDto} from './dto/simpleJobOrder.dto';
import {SalesForceCommandsService} from '../integrations/salesForce/salesForceCommands.service';

@Injectable()
export class JobOrderService {
  constructor(
    private readonly jobOrderRepository: JobOrderRepository,
    private readonly statusService: StatusService,
    private readonly exportHelper: ExportHelper,
    private readonly jobOrderAssociateRepository: JobOrderAssociateRepository,
    private readonly jobOrderLanguageRepository: JobOrderLanguageRepository,
    private readonly fileService: FileService,
    private readonly appConfig: AppConfigService,
    @Inject(forwardRef(() => InfoSystemCommandsService))
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
    @Inject(forwardRef(() => SalesForceCommandsService))
    private readonly salesForceCommandsService: SalesForceCommandsService,
    private readonly personService: PersonService,
    private readonly tenantRepository: TenantRepository,
    private readonly featureConfiguration: FeatureConfigurationService,
    private readonly logger: Logger,
    private readonly aamBackendService: AamBackendService,
    private readonly closeReasonService: CloseReasonService,
    private readonly jobOrderAuditLogService: JobOrderAuditLogService,
    private readonly candidateCache: CandidateCacheService,
    private readonly closeReasonArgumentsService: CloseReasonArgumentsService,
    private readonly jobOrderNotificationsService: JobOrderNotificationsService,
  ) {}

  private async getOrderDetailsListingStatuses(tenantId: number): Promise<PlainObject | null> {
    let orderDetailsListingStatuses = null;
    try {
      orderDetailsListingStatuses = await this.featureConfiguration.getFeatureConfigurationByFeatureName(
        tenantId,
        FeatureConfigurationFeature.OrderDetailsListingStatuses,
      );
    } catch (error) {
      this.logger.error(
        __filename,
        `Cant fetch feature configuration for 'OrderDetailsListingStatuses': ${error.message} ${error.stack}`,
        error,
      );
    }
    return orderDetailsListingStatuses;
  }

  async get(tenantId: number, id: string, additionalRelations: string[] = []): Promise<JobOrderDto> {
    const jobOrder = await this.jobOrderRepository.findOne(tenantId, id, true, true, true, additionalRelations);
    const tenant = await this.tenantRepository.findOne(tenantId); //TODO: Remove tenant when relation is resolved (#2355)
    if (jobOrder.closeReasonArguments) {
      jobOrder.closeReasonArguments.closedBy = await this.closeReasonArgumentsService.getClosedByUserName(
        jobOrder.closeReasonArguments,
        jobOrder.status.name,
      );
    }
    const jobOrderFiles = await this.fileService.fetchFilesByJobOrderId(tenantId, jobOrder.id);
    const jobOrderFilesWithDownloadUrl = await Promise.all(
      jobOrderFiles.map(
        async (file): Promise<any> => {
          let fileDownloadUrl = '';
          try {
            const fileDownload = await this.fileService.getFileBlobById(tenantId, file.id);
            fileDownloadUrl = fileDownload.url;
          } catch (error) {
            this.logger.error(__filename, `Couldn't fetch document URL`, error);
          }
          return {
            ...file,
            fileDownloadUrl: fileDownloadUrl,
          };
        },
      ),
    );
    const auditLog: AuditLog[] = await this.jobOrderAuditLogService.findJobOrderAudits(jobOrder);

    return new JobOrderDto(
      jobOrder,
      jobOrderFilesWithDownloadUrl,
      await this.getOrderDetailsListingStatuses(tenantId),
      tenant.name,
      auditLog,
    );
  }

  async getJobOrder(
    tenantId: number,
    clientId: string,
    jobOrderId: string,
    additionalRelations: string[] = [],
  ): Promise<JobOrderDto> {
    const jobOrder = await this.get(tenantId, jobOrderId, additionalRelations);
    if (jobOrder?.clientId !== clientId) {
      throw new SharedErrors.EntityNotFoundError({name: 'JobOrder', jobOrderId});
    }
    return jobOrder;
  }

  async findOneByTenantIdAndJobOrderId(
    tenantId: number,
    id: string,
    includeStatusDetails = true,
    includeUser = true,
    includeIsDisplayedFlag = true,
    additionalRelations: string[] = [],
  ): Promise<any> {
    return this.jobOrderRepository.findOne(
      tenantId,
      id,
      includeStatusDetails,
      includeUser,
      includeIsDisplayedFlag,
      additionalRelations,
    );
  }

  async upsertDraft(tenantId: number, jobOrderData: UpsertDraftJobOrderDto): Promise<JobOrder> {
    return await this._upsert(tenantId, JobOrderStatus.Draft, jobOrderData);
  }

  async upsert(tenantId: number, jobOrderData: UpsertJobOrderDto, createdByEvent: boolean = false): Promise<JobOrder> {
    return await this._upsert(tenantId, JobOrderStatus.Submitted, jobOrderData, createdByEvent);
  }

  private async _upsert(
    tenantId: number,
    statusName: string,
    jobOrderData: PlainObject,
    createdByEvent: boolean = false,
  ): Promise<JobOrder> {
    const jobOrderFetched =
      jobOrderData.id && !createdByEvent ? await this.jobOrderRepository.findOne(tenantId, jobOrderData.id) : null;
    if (!jobOrderFetched && jobOrderData.id && !createdByEvent) {
      throw new SharedErrors.EntityNotFoundError({name: JobOrder.name, id: jobOrderData.id});
    }

    try {
      const jobOrder = !jobOrderFetched
        ? new JobOrder(jobOrderData as UpsertDraftJobOrderDto)
        : new JobOrder({...jobOrderFetched, ...(jobOrderData as UpsertDraftJobOrderDto)});

      const status = await this.statusService.getStatusByName(tenantId, statusName, JobOrder.name);
      jobOrder.tenantId = tenantId;
      jobOrder.statusId = status.id;
      if (statusName === JobOrderStatus.Submitted && !jobOrderData.submissionDate) {
        jobOrder.submissionDate = new Date();
      }

      const jobOrderSaved = await getConnection().transaction(async (tManager) => {
        const jobOrderRepo = tManager.getCustomRepository(JobOrderRepository);
        const jobOrderLanguageRepo = tManager.getCustomRepository(JobOrderLanguageRepository);
        const jobOrderCertificationRepo = tManager.getCustomRepository(JobOrderCertificationRepository);

        const savedJobOrder = await jobOrderRepo.save(jobOrder);

        if (jobOrderData?.languages) {
          await jobOrderLanguageRepo.syncJobOrderLanguages(
            savedJobOrder.tenantId,
            savedJobOrder.id,
            jobOrderData?.languages,
          );
        }

        // TODO: Move this snippet to the repository the same way as it's already done for the languages above
        if (jobOrderData?.certifications) {
          await jobOrderCertificationRepo.deleteAllCertifications(savedJobOrder.tenantId, savedJobOrder.id);
          const certifications = jobOrderData?.certifications ?? [];
          const createdJobOrderCertifications = certifications.map((certification) => {
            const certificationData = {
              tenantId,
              jobOrderId: savedJobOrder.id,
              certificationId: certification.certificationId,
              dateStart: certification.dateStart,
              dateEnd: certification.dateEnd,
            };
            const jobOrderCertification = new JobOrderCertification(certificationData);
            return jobOrderCertificationRepo.save(jobOrderCertification);
          });
          await Promise.all(createdJobOrderCertifications);
        }

        return savedJobOrder;
      });

      const jobOrderObj = await this.jobOrderRepository.findOne(tenantId, jobOrderSaved.id);
      if (statusName === JobOrderStatus.Submitted && !createdByEvent) {
        const tenant = await this.tenantRepository.findOneWithRelations(tenantId);
        await this.infoSystemCommandsService.sendJobCreated(tenant, jobOrderObj);
        await this.salesForceCommandsService.sendJobCreated(tenant, jobOrderObj);
      }
      this.jobOrderNotificationsService.scheduleDueDateEmailNotifications(tenantId, jobOrderSaved.id);

      return jobOrderSaved;
    } catch (error) {
      throw new JobOrderError.JobOrderCreateError(null, error);
    }
  }

  async update(
    tenantId: number,
    id: string,
    jobOrderData: UpsertJobOrderDto,
    userId?: string,
    logOrigin: AuditLogOrigin = AuditLogOrigin.ClientAccess,
  ): Promise<JobOrder> {
    try {
      const jobOrder: JobOrder = await this.jobOrderRepository.findOne(tenantId, id);

      // Apply the changes to the JobOrder and save them
      Object.assign(jobOrder, jobOrderData);
      jobOrder.jobOrderLanguage = await this.jobOrderLanguageRepository.syncJobOrderLanguages(
        tenantId,
        id,
        jobOrderData.languages,
      );

      await this.jobOrderRepository.save(jobOrder);

      // Let's see whether we have to update the Status of the JobOrder
      const jobOrderStatus = await this.recalculateJobOrderStatus(tenantId, jobOrder.id, false);
      jobOrder.statusId = jobOrderStatus?.id;

      // And finally, log the update in the Audit Log
      if (userId) {
        //Check if this is an un-cancel event
        let logType: AuditLogType = AuditLogType.JobOrderUpdated;
        if (await this.isPreviousStatusCancelled(jobOrder)) {
          logType = AuditLogType.JobOrderUnCancelled;
        }

        await this.jobOrderAuditLogService.updateOrder(userId, jobOrder, logOrigin, logType);
      }

      if (logOrigin == AuditLogOrigin.ClientAccess) {
        const tenant = await this.tenantRepository.findOneWithRelations(tenantId);
        const updatedJobOrder = await this.findOneByTenantIdAndJobOrderId(tenantId, jobOrder.id, false, false, false);
        this.salesForceCommandsService.sendJobUpdated(tenant, updatedJobOrder);
      }

      return jobOrder;
    } catch (error) {
      throw new JobOrderError.JobOrderUpdateError(null, error);
    }
  }

  private async isPreviousStatusCancelled(jobOrder: JobOrder): Promise<boolean> {
    const jobOrderChanges = jobOrder.getAttributesChangeLog();
    if (jobOrderChanges?.statusId && jobOrderChanges?.statusId.old) {
      const cancelledStatus: StatusDto = await this.statusService.getStatusById(
        jobOrder.tenantId,
        Number(jobOrderChanges.statusId.old),
        JobOrder.name,
      );
      return (
        cancelledStatus.name === JobOrderStatus.CanceledByTheClient ||
        cancelledStatus.name === JobOrderStatus.CancelledByAdecco
      );
    }
    return false;
  }

  async fetchAll(
    tenantId: number,
    clientId: string,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    tenantUser: TenantUser,
  ): Promise<Pagination<JobOrder>> {
    try {
      return await this.jobOrderRepository.fetchAllJobOrders(
        tenantId,
        clientId,
        paginatorOptions,
        sortingOptions,
        filteringOptions,
        tenantUser,
        true,
        await this.getOrderDetailsListingStatuses(tenantId),
      );
    } catch (error) {
      throw new JobOrderError.JobOrderFetchError(null, error);
    }
  }

  async getCount(
    tenantId: number,
    clientId: string,
    filteringOptions: FilteringOptions,
    tenantUser: TenantUser,
  ): Promise<number> {
    try {
      return await this.jobOrderRepository.countJobOrders(tenantId, clientId, filteringOptions, tenantUser);
    } catch (error) {
      throw new JobOrderError.JobOrderFetchError(null, error);
    }
  }

  async getSimpleJobOrdersStartingInPeriod(
    tenantId: number,
    clientId: string,
    from: Date,
    to: Date,
    tenantUser: TenantUser,
  ): Promise<SimpleJobOrderDto[]> {
    try {
      return await this.jobOrderRepository.getSimpleJobOrdersStartingInPeriod(tenantId, clientId, from, to, tenantUser);
    } catch (error) {
      throw new JobOrderError.JobOrderFetchError(null, error);
    }
  }

  public async delete(tenantId: number, jobOrderId: string): Promise<JobOrder> {
    return await getConnection().transaction(async (tManager) => {
      const jobOrderRepo = tManager.getCustomRepository(JobOrderRepository);
      const jobOrderAssociateRepo = tManager.getCustomRepository(JobOrderAssociateRepository);
      const jobOrderLanguageRepo = tManager.getCustomRepository(JobOrderLanguageRepository);
      const jobOrderCertificationRepo = tManager.getCustomRepository(JobOrderCertificationRepository);

      const jobOrder = await jobOrderRepo.findOne(tenantId, jobOrderId);
      if (!jobOrder) {
        throw new SharedErrors.EntityNotFoundError({name: 'JobOrder', id: jobOrderId});
      }
      await jobOrderAssociateRepo.deleteAllJobOrderAssociates(tenantId, jobOrderId);
      await jobOrderLanguageRepo.deleteAllLanguages(tenantId, jobOrderId);
      await jobOrderCertificationRepo.deleteAllCertifications(tenantId, jobOrderId);

      return jobOrderRepo.delete(jobOrder);
    });
  }

  public async generateStaffingRequestsXlsx(options: GenerateXlsxOptions): Promise<GenerateXlsxDto> {
    const {tenantId, entityIds} = options;
    const relations = [
      'tenantUser',
      'tenantUser.user',
      'tenantUser.user.userProfile',
      'status',
      'location',
      'serviceType',
      'jobRole',
    ];

    try {
      const staffingRequests = await this.jobOrderRepository.findManyByIds(tenantId, entityIds, relations);
      const staffingRequestsXlsxData = await this.generateStaffingRequestsXlsxData(staffingRequests);

      return await this.exportHelper.generateXlsx(staffingRequestsXlsxData, XlsxTemplateNames.StaffingRequest);
    } catch (error) {
      throw new JobOrderError.JobOrderExportError(null, error);
    }
  }

  public async generateOrderDetailsXlsx(options: GenerateXlsxOptions): Promise<GenerateXlsxDto> {
    const {
      tenantId,
      entityIds: [jobOrderId],
    } = options;
    const additionalRelations = ['location', 'jobRole'];

    try {
      const jobOrderData = await this.get(tenantId, jobOrderId, additionalRelations);
      const jobOrderAssociatesData = await this.fetchActiveAssociates(tenantId, jobOrderId);
      const localizationData = await this.featureConfiguration.getOne(
        options.tenantId,
        FeatureConfigurationChannel.CLA,
        FeatureConfigurationFeature.Localization,
      );

      const currency = localizationData?.config?.defaultCurrency?.symbol ?? '';
      const orderDetailsXlsxData = this.generateOrderDetailsXlsxData(jobOrderData, currency);
      const candidatesListXlsxData = this.generateCandidatesListXlsxData(jobOrderAssociatesData);
      const jobOrderDetailsXlsxData = this.generateJobOrderDetailsXlsxData(
        orderDetailsXlsxData,
        candidatesListXlsxData,
      );

      return await this.exportHelper.generateXlsx(jobOrderDetailsXlsxData, XlsxTemplateNames.OrderDetails);
    } catch (error) {
      throw new JobOrderError.JobOrderExportError(null, error);
    }
  }

  /**
   * Check redis if there are some candidate data, otherwise, call aamBackend to fetch data.
   *
   * @private
   * @param {number} tenantId
   * @param {string[]} associateIds - List of candidate ids for fetch
   * @return {*}  {Promise<CandidateDto[]>}
   * @memberof JobOrderService
   */
  private async getAssociatesDataFromAamBackend(tenantId: number, associateIds: string[]): Promise<CandidateDto[]> {
    let associatesData: CandidateDto[] = [];
    const associateIdsForFetch: string[] = [];

    for (let index = 0; index < associateIds.length; index++) {
      const associateId = associateIds[index];
      // try to find associate data in redis
      const existingRedisAssociate = await this.candidateCache.get(associateId);
      if (existingRedisAssociate) {
        associatesData.push(existingRedisAssociate);
        continue;
      }
      associateIdsForFetch.push(associateId);
    }

    this.logger.info(__filename, 'Candidates from cache', {
      tenantId,
      infoCandidateIdList: associatesData.map((candidate) => candidate.id),
    });
    this.logger.info(__filename, 'Candidates to fetch', {
      tenantId,
      infoCandidateIdList: associateIdsForFetch,
      url: this.aamBackendService.getRequestUrl(UrlType.CandidatesListData),
    });

    if (associateIdsForFetch.length > 0) {
      const fetchedAssociates = await this.aamBackendService.getCandidateData(tenantId, associateIdsForFetch);
      // save associates data into redis
      for (let i = 0; i < fetchedAssociates.length; i++) {
        const associate = fetchedAssociates[i];
        await this.candidateCache.set(associate);
      }

      this.logger.info(__filename, 'Fetched candidates', {
        tenantId,
        list: (fetchedAssociates ?? []).map((i) => i?.id ?? i?.infoCandidateId),
      });

      associatesData = [...associatesData, ...(fetchedAssociates ?? [])];
    }

    return associatesData ?? [];
  }

  private async getAssociateData(tenantId: number, associate: PlainObject, useAamBackendData: boolean = false) {
    let aamBackendAssociateData: CandidateDto = {} as CandidateDto;
    if (useAamBackendData && associate?.associateId) {
      const associateData = await this.getAssociatesDataFromAamBackend(tenantId, [associate.associateId]);
      if (associateData.length > 0) {
        aamBackendAssociateData = associateData[0];
      }
    }
    if (associate.associateId) {
      const person = await this.personService.getById(tenantId, associate.associateId);
      associate.name = `${person.firstName} ${person.lastName}`;
      associate.jobOrderAssociateCases = (associate?.jobOrderAssociateCases ?? []).map((associateCase) => {
        return {
          caseCategoryName: associateCase?.case?.caseCategory?.name,
          caseId: associateCase?.case?.id,
        };
      });
      return {...associate, ...aamBackendAssociateData} as JobOrderAssociatesWithAamDataDto;
    }
    return {} as JobOrderAssociatesWithAamDataDto;
  }

  private async getAssociatesData(tenantId: number, associates: PlainObject[], filteringOptions?: any) {
    const preparedAssociates = [] as JobOrderAssociatesWithAamDataDto[];
    const filteredAssociates = [] as JobOrderAssociatesWithAamDataDto[];
    const associateIds = (associates ?? []).map((associate) => associate.associateId ?? null).filter((id) => id);
    const associatesDataFromAamBackend = await this.getAssociatesDataFromAamBackend(tenantId, associateIds);

    for (const associate of associates) {
      if (associate.associateId) {
        preparedAssociates.push({
          ...associate,
          ...(await this.getAssociateData(tenantId, associate, false)),
          ...(associatesDataFromAamBackend.find(({id}) => id === associate.associateId) ?? {}),
        });
      }
    }
    const customFilter = filteringOptions?.filter?.customFilter;
    if (customFilter?.length > 0) {
      preparedAssociates.forEach((associate) => {
        let isMatch = true;
        customFilter.forEach((oneFilter) => {
          switch (oneFilter.key) {
            case 'experienceLevel':
              let experienceLevelMatch = false;
              oneFilter.value.forEach((oneValue) => {
                if (oneValue.from < associate.yearsOfExperience && associate.yearsOfExperience < oneValue.to) {
                  experienceLevelMatch = true;
                }
              });
              if (!experienceLevelMatch) {
                isMatch = false;
              }
              break;
            case 'language':
              oneFilter.value.forEach((language) => {
                if (!associate.languages?.includes(language)) {
                  isMatch = false;
                }
              });
              break;
            case 'candidates-location':
              oneFilter.value.forEach((location) => {
                if (!(associate.city === location.city && associate.country === location.country)) {
                  isMatch = false;
                }
              });
              break;
            case 'levelOfEducation':
              if (!oneFilter.value.includes(associate.educationType)) {
                isMatch = false;
              }
              break;
          }
        });
        if (isMatch) {
          filteredAssociates.push(associate);
        }
      });
      return filteredAssociates;
    }
    return preparedAssociates;
  }

  public async fetchAssociates(tenantId: number, jobOrderId: string) {
    const associates = await this.jobOrderAssociateRepository.fetchAssociates(tenantId, jobOrderId);

    return this.getAssociatesData(tenantId, associates);
  }

  public async fetchActiveAssociates(tenantId: number, jobOrderId: string) {
    const associates = await this.jobOrderAssociateRepository.fetchActiveAssociates(tenantId, jobOrderId);

    return this.getAssociatesData(tenantId, associates);
  }

  public async fetchJobOrderAssociateData(
    tenantId: number,
    jobOrderId: string,
    associateId: string,
  ): Promise<JobOrderAssociatesDto> {
    const candidate = await this.jobOrderAssociateRepository.findOne(jobOrderId, tenantId, associateId, true, false, [
      'jobOrderAssociateCases',
      'jobOrderAssociateCases.case',
      'jobOrderAssociateCases.case.caseCategory',
    ]);

    if (!candidate) {
      throw new SharedErrors.EntityNotFoundError({name: 'JobOrderAssociate', id: associateId});
    }

    const associateData = this.getAssociateData(
      tenantId,
      {
        associateId: candidate.userId,
        status: candidate?.status?.name,
        statusId: candidate?.status?.id,
        createdAt: candidate.createdAt,
        jobOrderAssociateCases: candidate.jobOrderAssociateCases,
        movedBackFromSelect: candidate.movedBackFromSelect,
        interviewDate: candidate.interviewDate,
        rejected: candidate.rejected,
      },
      true,
    );

    return associateData;
  }

  async fetchActivePaginatedAssociates(
    tenantId: number,
    jobOrderId: string,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    loadedCandidateIds: string[],
  ): Promise<Pagination<JobOrderAssociatesDto>> {
    try {
      const associates = await this.jobOrderAssociateRepository.fetchPaginatedAssociates(
        tenantId,
        jobOrderId,
        paginatorOptions,
        sortingOptions,
        filteringOptions,
        loadedCandidateIds,
      );
      return {
        ...associates,
        results: await this.getAssociatesData(tenantId, associates.results as PlainObject[], filteringOptions),
      };
    } catch (error) {
      throw new UserServiceErrors.UserFetchColleaguesError(null, error);
    }
  }

  public async getJobOrderRelatedStatuses(tenantId: number): Promise<StatusDto[]> {
    return (await this.statusService.getAll(tenantId)).filter((status) =>
      [JobOrder.name, JobOrderAssociate.name].includes(status.entityName),
    );
  }

  public async recalculateJobOrderStatus(
    tenantId: number,
    jobOrderId: string,
    isInternalAction: boolean,
  ): Promise<StatusDto | undefined> {
    const statuses = await this.getJobOrderRelatedStatuses(tenantId);

    return await this.jobOrderRepository.recalculateJobOrderStatus(tenantId, jobOrderId, statuses, isInternalAction);
  }

  public async createFiles(
    tenantId: number,
    jobOrderId: string,
    files: Express.Multer.File[],
    userId: string,
  ): Promise<any> {
    const path: string = `jobOrder/${jobOrderId}/file`;
    try {
      await this.fileService.uploadFiles(
        tenantId,
        userId,
        files,
        path,
        {entityId: jobOrderId, entityName: JobOrder.name},
        true,
      );
      await this.fileService.fetchFilesByJobOrderId(tenantId, jobOrderId);
    } catch (error) {
      throw new JobOrderError.JobOrderFileUploadError(null, error);
    }
  }

  async groupStuffingRequestsByStatus(
    tenantId: number,
    clientId: string,
    filteringOptions: FilteringOptions,
  ): Promise<any> {
    try {
      return await this.jobOrderRepository.groupStuffingRequestsByStatus(tenantId, clientId, filteringOptions);
    } catch (error) {
      throw new JobOrderError.StuffingRequestAggregateError(null, error);
    }
  }

  /**
   * Closes job order, recalculates the job order status and returns close reason data by provided close reason parameters, tenant and job order ids.
   *
   * @param {number} tenantId - Id of current tenant
   * @param {string} jobOrderId - Id of current job order
   * @param {CloseReasonArgumentsPayload} payload - Data from the request body
   * @param {PlainObject} systemData - Contextual data for closing reason
   * @returns {Promise<CloseReasonArgumentsDto>} - Promise, retrieving the close reason data
   */
  public async close(
    tenantId: number,
    jobOrderId: string,
    payload: CloseReasonArgumentsPayload,
    systemData: {
      tenantName: string;
      userId: string;
      isClosedFromCLA: boolean;
    },
  ): Promise<any> {
    try {
      const jobOrder: JobOrder = await this.findOneByTenantIdAndJobOrderId(tenantId, jobOrderId, true, false, false);
      if (
        !jobOrder ||
        jobOrder.closeReasonArguments ||
        jobOrder.status.name === JobOrderStatus.CanceledByTheClient ||
        jobOrder.status.name === JobOrderStatus.CancelledByAdecco
      ) {
        throw new Error('Job Order is already closed.');
      } else {
        const closeReasonArgs: CloseReasonArgumentsDto = await this.closeReasonArgumentsService.create(
          tenantId,
          jobOrderId,
          {
            userId: systemData.userId,
            tenantName: systemData.tenantName,
            isClosedFromCLA: systemData.isClosedFromCLA,
            closeReasonId: payload.closeReasonId,
            comment: payload.comment,
          },
        );
        await this.recalculateJobOrderStatus(tenantId, jobOrderId, systemData.isClosedFromCLA);

        const tenant = await this.tenantRepository.findOneWithRelations(tenantId);
        const updatedJobOrder = await this.findOneByTenantIdAndJobOrderId(tenantId, jobOrderId, false, false, false);
        await this.salesForceCommandsService.sendJobUpdated(tenant, updatedJobOrder);
        return closeReasonArgs;
      }
    } catch (error) {
      throw new JobOrderError.StuffingRequestAggregateError(null, error);
    }
  }

  /**
   * Generates the staffing requests data that the XLSX file will contain.
   *
   * @param {Array<JobOrder>} staffingRequestsData - Records from JobOrder repository.
   * @returns {StaffingRequestsXlsxDto} - The data that will be included in the XLSX file.
   */
  private generateStaffingRequestsXlsxData(staffingRequestsData: JobOrder[]): StaffingRequestsXlsxDto {
    const dateFormatLong = 'PPPPp';
    const dateFormatShort = 'dd MMM yyyy';
    const title = `Staffing requests report - ${dateFns.format(new Date(), dateFormatLong)}`;
    const data = staffingRequestsData.map(
      (data): StaffingRequestXlsxDto => {
        const user = data.tenantUser?.user?.userProfile;
        const createBy = user ? `${user.firstName} ${user.lastName}` : UtilsHelper.formatReferenceNumber(data.userId);

        return {
          createBy,
          number: UtilsHelper.formatReferenceNumber(data.id),
          name: data.name ?? '',
          serviceType: data.serviceType?.name ?? '',
          submissionDate: dateFns.format(data.submissionDate, dateFormatShort),
          startDate: dateFns.format(data.dateStart, dateFormatShort),
          endDate: dateFns.format(data.dateEnd, dateFormatShort),
          noOfPositions: data.numberOfOpenings,
          status: data.status?.name ?? '',
          location: data.location?.locationName ?? '',
          role: data.jobRole?.name ?? '',
        };
      },
    );

    return {title, data};
  }

  /**
   * Generates the data that the XLSX file will contain in 'Order Details' sheet.
   *
   * @param {JobOrderDto} jobOrderData - Record from JobOrder repository.
   * @param {string} currency - The currency symbol that is used by the tenant.
   * @returns {OrderDetailsDataXlsxDto} - The data that will be included inside the 'Order Details' sheet of the XLSX file.
   */
  private generateOrderDetailsXlsxData(jobOrderData: JobOrderDto, currency: string): OrderDetailsDataXlsxDto {
    const dateFormat = 'dd MMM yyyy';
    const incomingTimeFormat = 'HH:mm:ss';
    const outgoingTimeFormat = 'HH:mm';
    const {
      name,
      id,
      createdAt,
      userName,
      salary,
      location,
      jobRole,
      numberOfOpenings,
      jobOrderLanguage,
      dateStart,
      dateEnd,
      daysInWeek,
      startTime,
      endTime,
      dayOneGuidance,
    } = jobOrderData;
    const formattedStartTime = startTime
      ? dateFns.format(dateFns.parse(startTime, incomingTimeFormat, new Date()), outgoingTimeFormat)
      : '';
    const formattedEndTime = endTime
      ? dateFns.format(dateFns.parse(endTime, incomingTimeFormat, new Date()), outgoingTimeFormat)
      : '';
    const workTime = formattedStartTime && formattedEndTime ? `From ${formattedStartTime} To ${formattedEndTime}` : '';
    const languages = (jobOrderLanguage ?? []).map(({value, level}) => `${value.name} - ${level.name}`).join(', ');
    const numOfWorkingDays = dateStart && dateEnd ? this.countWorkingDays(dateStart, dateEnd, daysInWeek) : null;
    const estimatedSalary = salary ? `${this.calculateEstimatedSalary(jobOrderData)} ${currency}` : '';

    const data: OrderDetailsDataXlsxDto = {
      referenceNumber: UtilsHelper.formatReferenceNumber(id),
      name,
      languages,
      workTime,
      numOfWorkingDays,
      userName,
      scheduledPeriod: `${dateFns.format(dateStart, dateFormat)} - ${dateFns.format(dateEnd, dateFormat)}`,
      numberOfOpenings: numberOfOpenings ?? null,
      dateSubmission: dateFns.format(createdAt, dateFormat),
      salary: estimatedSalary,
      location: location?.locationName ?? '',
      roleAndExperience: jobRole?.name ?? '',
      workingDays: (daysInWeek ?? []).join(', '),
      dayOneGuidance: dayOneGuidance ?? '',
    };

    return data;
  }

  /**
   * Generates the data that the XLSX file will contain in 'Candidates List' sheet.
   *
   * @param {Array<JobOrderAssociatesWithAamDataDto>} candidatesData - List of candidates info.
   * @returns {Array<JobOrderAssociatesDataXlsxDto>} - The data that will be included inside the 'Candidates List' sheet of the XLSX file.
   */
  private generateCandidatesListXlsxData(
    candidatesData: JobOrderAssociatesWithAamDataDto[],
  ): JobOrderAssociatesDataXlsxDto[] {
    const empty = '-- N/A --';
    const separator = ', ';
    const data = candidatesData.map(
      ({
        name,
        associateId,
        status,
        yearsOfExperience,
        languages,
        city,
        country,
        workExperience,
        educationType,
        interviewDate,
      }: JobOrderAssociatesWithAamDataDto): JobOrderAssociatesDataXlsxDto => {
        const showName =
          interviewDate ||
          status === JobOrderAssociateStatus.PreContract ||
          status === JobOrderAssociateStatus.ClosingReport;
        const workingExperience = workExperience
          ? workExperience.map((exp) => `${exp.roleName}- ${exp.yearsOfExperience} year(s)`).join(separator)
          : empty;

        return {
          id: UtilsHelper.formatReferenceNumber(associateId),
          name: showName && name ? name : empty,
          dateOfSearch: empty, // TODO: add or remove when integration is done
          status: status ?? empty,
          yearsOfExperience: yearsOfExperience ? String(yearsOfExperience) : empty,
          languages: languages ? languages.join(separator) : empty,
          location: [city, country].filter(Boolean).join(separator) || empty,
          universityDegree: educationType ?? empty,
          workingExperience,
        };
      },
    );

    return data;
  }

  /**
   * Accumulates all the data that will be included in the XLSX file (all sheets).
   *
   * @param {OrderDetailsDataXlsxDto} orderDetails - The data for the 'Order Details' sheet of the XLSX file.
   * @param {JobOrderAssociatesDataXlsxDto} candidatesList - The data for the 'Candidates List' sheet of the XLSX file.
   * @returns {JobOrderDetailsDataXlsxDto} - The data that will be included in the XLSX file.
   */
  private generateJobOrderDetailsXlsxData(
    orderDetails: OrderDetailsDataXlsxDto,
    candidatesList: JobOrderAssociatesDataXlsxDto[],
  ): JobOrderDetailsXlsxDto {
    const title = `Job order details report - ${dateFns.format(new Date(), 'PPPPp')}`;
    const data: JobOrderDetailsDataXlsxDto = {
      orderDetails,
      candidatesList,
    };

    return {title, data};
  }

  /**
   * Calculates the estimated salary for a given order record.
   * Formula: wage * working hours * working days * number of workers.
   *
   * @param {JobOrderDto} - A job order record
   * @returns {string} - The estimated salary
   */
  public calculateEstimatedSalary({
    salary,
    daysInWeek,
    dateStart,
    dateEnd,
    endTime,
    startTime,
    numberOfOpenings,
  }: JobOrderDto): string {
    if (!salary) return null;

    const workingDaysCount: number = this.countWorkingDays(dateStart, dateEnd, daysInWeek);
    const workingHoursCount: number = this.countWorkingHours(startTime, endTime);
    let estimatedSalary: string = '';
    if (workingDaysCount <= 0 || isNaN(workingDaysCount) || workingHoursCount <= 0 || isNaN(workingHoursCount)) {
      estimatedSalary = Number(salary).toFixed(2);
    } else {
      estimatedSalary = (Number(salary) * numberOfOpenings * workingDaysCount * workingHoursCount).toFixed(2);
    }

    return estimatedSalary;
  }

  /**
   * Calculates the total number working days for a given period of time
   * and based on a given working days of a week.
   *
   * @param {Date} startDate
   * @param {Date} endDate
   * @param {Array<string>} daysOfWeek - array with days of the week as a lower cased strings
   * @return {number} - The total number of working days
   */
  private countWorkingDays(startDate: Date, endDate: Date, daysOfWeek: string[]): number {
    let workingDaysCounter = 0;
    const sDate = dateFns.toDate(startDate);
    const eDate = dateFns.toDate(endDate);

    for (let date = sDate; dateFns.isBefore(date, eDate); date = dateFns.addDays(date, 1)) {
      const currentDay = dateFns.format(date, 'EEEE').toLowerCase();
      const isWorkingDay = daysOfWeek.includes(currentDay);

      workingDaysCounter += isWorkingDay ? 1 : 0;
    }

    return workingDaysCounter;
  }

  /**
   * Calculates the number of working hours.
   *
   * @param {string} startDate - An hour in a "HH:mm:ss" format
   * @param {string} endDate - An hour in a "HH:mm:ss" format
   *
   * @return {number} - The hours difference between 2 hours(HH:mm:ss) as a decimal number
   */
  private countWorkingHours(startHour: string, endHour: string): number {
    const sTime = dateFns.parse(startHour, 'HH:mm:ss', new Date());
    let eTime = dateFns.parse(endHour, 'HH:mm:ss', new Date());
    // Changes 'eTime' to next day relative to 'sDate' (covers night shift cases, where 'startHour' is bigger than 'endHour')
    if (dateFns.isBefore(eTime, sTime)) {
      eTime = dateFns.setDate(eTime, dateFns.getDay(sTime) + 1);
    }

    return dateFns.differenceInHours(sTime, eTime);
  }
}
