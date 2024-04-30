import {CommonIntegrationError} from '../../commonIntegration.error';
import * as dateFns from 'date-fns';
import {Tenant} from './../../../tenant/tenant.entity';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {InfoSystemCommand} from './../infoSystemIntegrationTypes';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {v4 as uuid} from 'uuid';
import {BusMessage} from '../../../busMessage/busMessage.entity';
import {TenantService} from '../../../tenant/tenant.service';
import {InfoSystemError} from '../infoSystem.error';
import {JobOrderService} from '../../../jobOrder/jobOrder.service';
import {InfoSystemCommandsService} from '../infoSystemCommands.service';
import {MessageRecordType} from '../eventModels';
import {JobOrderAssociate} from '../../../jobOrderAssociate/jobOrderAssociate.entity';
import {TransformationsService} from 'src/modules/transformations/transformation.service';
import {EC_Transformations} from 'src/modules/transformations/eventsAndCommandsTransformations.data';
import {FileRepository} from 'src/modules/file/file.repository';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {ServiceTypeEnum} from 'src/modules/serviceType/serviceType.enum';
import {BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';

@Injectable()
export class JobOrderCommandsService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly jobOrderService: JobOrderService,
    @Inject(forwardRef(() => InfoSystemCommandsService))
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
    private readonly transformationsService: TransformationsService,
    private readonly fileRepository: FileRepository,
    private readonly appConfig: AppConfigService,
  ) {}
  public async getCreateJobCommand(
    commandName: string,
    tenant: Tenant,
    jobOrder: JobOrder,
  ): Promise<InfoSystemCommand> {
    let startTime = null;
    let endTime = null;

    if (jobOrder.startTime) startTime = jobOrder.startTime;
    if (jobOrder.endTime) endTime = jobOrder.endTime;

    let payload: any = {
      commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        contactRecordType: MessageRecordType.Client,
        additionalInformation: jobOrder.additionalInformation,
        branchId: jobOrder.branchId,
        dateStart: dateFns.format(jobOrder.dateStart, 'yyyy-MM-dd'),
        // For JobOrders with permanent contract type the dateEnd property is null, as the contract does not have a specified end date
        dateEnd: jobOrder.dateEnd ? dateFns.format(jobOrder.dateEnd, 'yyyy-MM-dd') : null,
        id: jobOrder.id,
        interviewRequired: jobOrder.interviewRequired,
        jobDescription: jobOrder.jobDescription,
        locationId: jobOrder.locationId,
        name: jobOrder.name,
        numberOfOpenings: jobOrder.numberOfOpenings,
        salaryLow: jobOrder.salary,
        salaryHigh: !jobOrder.salaryHigh || ['', '0', 0].includes(jobOrder.salaryHigh) ? null : jobOrder.salaryHigh,
        userId: jobOrder.userId,
        daysInWeek: jobOrder.daysInWeek,
        startTime: startTime,
        endTime: endTime,
        dayOneGuidance: jobOrder.dayOneGuidance,
        sourceOfTheJob: 'App/Portal',
      },
      keyValues: {
        contractTypeId: jobOrder.contractTypeId,
        rateId: jobOrder.rateId,
        serviceTypeId: jobOrder.serviceTypeId,
        shiftId: jobOrder.shiftId,
        experienceId: jobOrder.experienceId,
      },
    };
    payload = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.createJob,
      payload,
      BusMessageTypeEnum.COMMAND,
    );

    if (this.appConfig.transformationsConfig.useCLPTransformations) {
      if (payload?.parameters?.serviceType !== ServiceTypeEnum.Permanent) {
        payload.parameters.minimumPayRate = payload.parameters.salary;
        payload.parameters.maximumPayRate = payload.parameters.salaryHigh;
      }
    }

    return payload;
  }

  public async onCreateJobSuccess(busMessage: BusMessage) {
    try {
      const {
        body: {
          brand,
          country,
          parameters: {id: jobOrderId},
        },
      } = busMessage.payload;
      // find tenant
      const tenant = await this.tenantService.getByBrandAndCountry(brand, country);
      if (!tenant) {
        throw new CommonIntegrationError.CountryBrandNotFound();
      }

      // find job order
      const existingJobOrder = await this.jobOrderService.findOneByTenantIdAndJobOrderId(
        tenant.id,
        jobOrderId,
        false, // dont include status data
        false, // dont include user data
        false, // dont consider 'isDisplayed' flag
        ['jobRole'],
      );
      if (!existingJobOrder) {
        throw new CommonIntegrationError.JobOrderNotFound();
      }

      await this.infoSystemCommandsService.sendSkillsCreated(tenant, existingJobOrder);

      const files = await this.fileRepository.findByJobOrderId(tenant.id, jobOrderId, false);
      const fileIntegrationCommandsPromises = files.map((entity) =>
        this.infoSystemCommandsService.sendDocumentCreated(tenant, entity),
      );
      await Promise.all(fileIntegrationCommandsPromises);
    } catch (error) {
      throw new InfoSystemError.InfoSystemInvalidDataError({
        message: ' Chained command (JobOrderCreated) -> sendSkillsCreated error',
      });
    }
  }

  public getUpdateJobProcessCommand(
    commandName: string,
    tenant: Tenant,
    jobOrderAssociate: JobOrderAssociate,
  ): Promise<InfoSystemCommand> {
    const payload = {
      commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        jobOrderId: jobOrderAssociate.jobOrderId,
        userId: jobOrderAssociate.userId,
      },
      keyValues: {
        statusId: jobOrderAssociate.statusId,
      },
    };
    return this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.updateJobProcess,
      payload,
      BusMessageTypeEnum.COMMAND,
    );
  }
}
