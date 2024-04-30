import {IntegrationLogs} from './../../integrationLogging.service';
import {CommonIntegrationError} from '../../commonIntegration.error';
import * as dateFns from 'date-fns';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {CloseReasonService} from 'src/modules/closeReason/closeReason.service';
import {CloseReasonArgumentsService} from './../../../closeReasonArguments/closeReasonArguments.service';
import {Injectable} from '@nestjs/common';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {TenantService} from 'src/modules/tenant/tenant.service';
import {JobOrderService} from 'src/modules/jobOrder/jobOrder.service';
import {LocationService} from 'src/modules//location/location.service';
import {UpsertJobOrderDto} from 'src/modules/jobOrder/dto/upsertJobOrder.dto';
import {JobOrderAssociate} from 'src/modules/jobOrderAssociate/jobOrderAssociate.entity';
import {JobOrderNotificationsService} from 'src/modules/jobOrder/jobOrderNotifications.service';
import {InfoSystemError} from '../infoSystem.error';
import {InfoSystemEvent, JobCreatedData, JobUpdatedData} from '../eventModels';
import {JobProcessUpdatedData} from '../eventModels/jobProcessUpdatedData';
import {getConnection} from 'typeorm';
import {JobOrderRepository} from '../../../jobOrder/jobOrder.repository';
import {JobOrderAssociateRepository} from '../../../jobOrderAssociate/jobOrderAssociate.repository';
import {TransformationsService} from 'src/modules/transformations/transformation.service';
import {EC_Transformations} from 'src/modules/transformations/eventsAndCommandsTransformations.data';
import {AuditLogOrigin} from 'src/modules/auditLog/auditLog.enum';
import {IntegrationSystemLogType} from '../../integrationSystem.enum';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {ServiceTypeEnum} from 'src/modules/serviceType/serviceType.enum';
import {BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';

@Injectable()
export class JobOrderEventsService {
  public constructor(
    private readonly tenantService: TenantService,
    private readonly jobOrderService: JobOrderService,
    private readonly jobOrderNotificationsService: JobOrderNotificationsService,
    private readonly locationService: LocationService,
    private readonly closeReasonArgumentsService: CloseReasonArgumentsService,
    private readonly closeReasonService: CloseReasonService,
    private readonly transformationsService: TransformationsService,
    private readonly integrationLogs: IntegrationLogs,
    private readonly appConfig: AppConfigService,
  ) {}

  private formatDate(date: Date | null): Date | null {
    return date ? dateFns.toDate(date) : null;
  }

  private parseExperienceLevelId(experienceId: number | null): number | null {
    return experienceId ? experienceId : null; // this will handle experienceId: 0
  }

  public async onJobCreated(event: InfoSystemEvent<JobCreatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'JobOrder Created',
    );

    if (!event.eventId) {
      throw new CommonIntegrationError.EventIdNotProvided();
    }

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const location = await this.locationService.findOne(event.parameters.locationId);
    if (!location) {
      throw new CommonIntegrationError.LocationNotFound();
    }

    event.keyValues = {
      contractType: event.parameters.contractType,
      payRatePeriod: event.parameters.rate,
      recordTypeDeveloperName: event.parameters.serviceType,
      shift: event.parameters.shift,
      yearsOfExperience: event.parameters.experience,
    };

    const transformedEvent = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.jobCreated,
      event,
      BusMessageTypeEnum.EVENT,
    );

    const jobOrderData: UpsertJobOrderDto = {
      submissionDate: this.formatDate(
        event.parameters.submissionDate ? new Date(event.parameters.submissionDate) : null,
      ),
      additionalInformation: event.parameters.additionalInformation,
      branchId: event.parameters.branchId,
      contractTypeId: transformedEvent.parameters.contractTypeId,
      dateEnd: this.formatDate(event.parameters.dateEnd ? new Date(event.parameters.dateEnd) : null),
      dateStart: this.formatDate(event.parameters.dateStart ? new Date(event.parameters.dateStart) : null),
      id: event.parameters.id,
      interviewRequired: event.parameters.interviewRequired,
      jobDescription: event.parameters.jobDescription,
      locationId: event.parameters.locationId,
      name: event.parameters.name,
      numberOfOpenings: event.parameters.numberOfOpenings,
      rateId: transformedEvent.parameters.rateId,
      serviceTypeId: transformedEvent.parameters.serviceTypeId,
      shiftId: transformedEvent.parameters.shiftId,
      userId: event.parameters.userId,
      isDisplayed: event.parameters.isDisplayed,
      clientId: location.clientId,
      experienceId: this.parseExperienceLevelId(transformedEvent.parameters.experienceId),
      startTime: event.parameters.startTime,
      endTime: event.parameters.endTime,
      dayOneGuidance: event.parameters.dayOneGuidance ? event.parameters.dayOneGuidance : null,
      daysInWeek: event.parameters.daysInWeek,
      ...this.getSalaryObject(transformedEvent),
    };

    await this.jobOrderService.upsert(tenant.id, jobOrderData, true);
  }

  public async onJobUpdated(event: InfoSystemEvent<JobUpdatedData>) {
    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);

    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }
    const tenantId = tenant.id;

    const {id: jobOrderId} = event.parameters;
    const existingJobOrder = await this.jobOrderService.findOneByTenantIdAndJobOrderId(
      tenantId,
      jobOrderId,
      false, // dont include status data
      false, // dont include user data
      false, // dont consider 'isDisplayed' flag
    );
    if (!existingJobOrder) {
      throw new CommonIntegrationError.JobOrderNotFound();
    }

    event.keyValues = {
      contractType: event.parameters.contractType,
      payRatePeriod: event.parameters.rate,
      recordTypeDeveloperName: event.parameters.serviceType,
      shift: event.parameters.shift,
      yearsOfExperience: event.parameters.experience,
      closedReason: event.parameters.closingReason,
    };

    const transformedEvent = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.jobUpdated,
      event,
      BusMessageTypeEnum.EVENT,
    );

    if (transformedEvent.parameters.closingReason) {
      try {
        const existingCloseReason = await this.closeReasonService.findOne(
          tenantId,
          transformedEvent.parameters.closingReason,
        );
        try {
          await this.closeReasonArgumentsService.create(tenantId, jobOrderId, {
            userId: UtilsHelper.dbUuid(), // TO DO: remove this when we receive some userId from inFO or make closeReasonArgument.closedBy column nullable
            comment: existingCloseReason.reason,
            tenantName: tenant.name,
            closeReasonId: transformedEvent.parameters.closingReason,
            isClosedFromCLA: false,
          });
        } catch (error) {
          throw new InfoSystemError.CloseReasonArgumentCreate();
        }
      } catch (error) {
        throw new InfoSystemError.CloseReasonNotFound();
      }
    }

    // remove existing closeReasonArgument if external system unset this value
    if (existingJobOrder?.closeReasonArguments && transformedEvent.parameters.closingReason === null) {
      try {
        await this.closeReasonArgumentsService.delete(existingJobOrder.closeReasonArguments);
      } catch (error) {
        throw new InfoSystemError.CloseReasonArgumentDelete();
      }
    }

    delete transformedEvent.parameters.contractType;
    delete transformedEvent.parameters.rate;
    delete transformedEvent.parameters.serviceType;
    delete transformedEvent.parameters.shift;
    delete transformedEvent.parameters.experience;
    delete transformedEvent.parameters.closingReason;

    const jobOrderData: UpsertJobOrderDto = {
      ...existingJobOrder,
      ...transformedEvent.parameters,
      ...this.getSalaryObject(transformedEvent),
      experienceId: this.parseExperienceLevelId(transformedEvent.parameters.experienceId),
      startTime: event.parameters.startTime,
      endTime: event.parameters.endTime,
    };

    if (event.parameters.dateEnd) {
      jobOrderData.dateEnd = this.formatDate(new Date(event.parameters.dateEnd));
    }
    if (event.parameters.dateStart) {
      jobOrderData.dateStart = this.formatDate(new Date(event.parameters.dateStart));
    }

    //update job order data and make the necessary logs
    await this.jobOrderService.update(
      tenantId,
      jobOrderId,
      new JobOrder(jobOrderData),
      jobOrderData.userId,
      AuditLogOrigin.INFO,
    );
  }

  public async onJobProcessCreated(event: InfoSystemEvent<any>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'JobProcess Created',
      event,
    );

    const {
      country,
      brand,
      parameters: {userId, jobOrderId, status},
    } = event;
    const tenant = await this.tenantService.getByBrandAndCountry(brand, country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    event.keyValues = {
      stage: status,
    };

    const transformedEvent = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.jobProcessCreated,
      event,
      BusMessageTypeEnum.EVENT,
    );

    const jobOrderAssociateToCreate = new JobOrderAssociate({
      tenantId: tenant.id,
      userId,
      jobOrderId,
      statusId: transformedEvent?.parameters?.statusId,
    });

    const statuses = await this.jobOrderService.getJobOrderRelatedStatuses(tenant.id);
    await getConnection().transaction(async (tManager) => {
      const jobOrderAssociateRepository = tManager.getCustomRepository(JobOrderAssociateRepository);
      const jobOrderAssociate = await jobOrderAssociateRepository.save(jobOrderAssociateToCreate);
      if (jobOrderAssociate) {
        const jobOrderRepository = tManager.getCustomRepository(JobOrderRepository);
        await jobOrderRepository.recalculateJobOrderStatus(tenant.id, jobOrderId, statuses, false);
      }
    });
  }

  /**
   * Handle an InFO event with information regarding a change of the status of a JobOrderAssociate
   *
   * @param {InfoSystemEvent<JobProcessUpdatedData>} event - The event which we received from InFO containing information for the candidate
   */
  public async onJobProcessUpdated(event: InfoSystemEvent<JobProcessUpdatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'JobOrder Updated',
      event,
    );

    const {
      country,
      brand,
      parameters: {userId, jobOrderId, status: candidateStatus, rejected, interviewDate},
    } = event;

    const tenant = await this.tenantService.getByBrandAndCountry(brand, country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    event.keyValues = {
      stage: candidateStatus,
    };

    const transformedEvent = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.jobProcessUpdated,
      event,
      BusMessageTypeEnum.EVENT,
    );

    const jobOrderAssociateToCreate = new JobOrderAssociate({
      tenantId: tenant.id,
      userId,
      jobOrderId,
      statusId: transformedEvent?.parameters?.statusId,
      rejected,
      interviewDate,
    });

    let jobOrder = null;
    let status = null;
    const statuses = await this.jobOrderService.getJobOrderRelatedStatuses(tenant.id);
    await getConnection().transaction(async (tManager) => {
      const jobOrderAssociateRepository = tManager.getCustomRepository(JobOrderAssociateRepository);
      const jobOrderAssociate = await jobOrderAssociateRepository.save(jobOrderAssociateToCreate);
      if (jobOrderAssociate) {
        const jobOrderRepository = tManager.getCustomRepository(JobOrderRepository);
        jobOrder = await jobOrderRepository.findOne(tenant.id, jobOrderId, true, true, true, ['jobRole']);
        status = await jobOrderRepository.recalculateJobOrderStatus(tenant.id, jobOrderId, statuses, false);

        if (rejected) {
          await this.jobOrderNotificationsService.sendAssociateNotAvailableEmailNotification(
            jobOrder,
            jobOrderAssociate.userId,
          );
        }
      }
    });

    if (jobOrder && status) {
      await this.jobOrderNotificationsService.schedulePartiallyCoveredEmailNotification(jobOrder, status);
      await this.jobOrderNotificationsService.sendStatusChangedEmailNotification(jobOrder, status);
    }
  }

  public getSalaryObject(transformedEvent) {
    let salaryDateObj = {
      salary: transformedEvent.parameters.salaryLow,
      salaryHigh: transformedEvent.parameters.salaryHigh,
    };

    if (this.appConfig.transformationsConfig.useCLPTransformations) {
      if (transformedEvent?.parameters?.serviceType !== ServiceTypeEnum.Permanent) {
        salaryDateObj = {
          ...salaryDateObj,
          salary: transformedEvent?.parameters?.minimumPayRate,
          salaryHigh: transformedEvent?.parameters?.maximumPayRate,
        };
      }
    }

    return salaryDateObj;
  }
}
