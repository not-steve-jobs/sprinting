import {BusMessage} from './../../../busMessage/busMessage.entity';
import {SalesForceCommand} from './../salesForceIntegrationTypes';
import {Tenant} from './../../../tenant/tenant.entity';
import {Injectable} from '@nestjs/common';
import * as dateFns from 'date-fns';
import {v4 as uuid} from 'uuid';
import {TenantService} from '../../../tenant/tenant.service';
import {CommonIntegrationError} from '../../commonIntegration.error';
import {SalesForceError} from '../salesForce.error';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {ClientProfileRepository} from 'src/modules/clientProfile/clientProfile.repository';
import {UserProfileRepository} from 'src/modules/userProfile/userProfile.repository';
import {LocationRepository} from 'src/modules/location/location.repository';
import {DepartmentRepository} from 'src/modules/department/department.repository';
import {TransformationsService} from 'src/modules/transformations/transformation.service';
import {EC_Transformations} from 'src/modules/transformations/eventsAndCommandsTransformations.data';
import {BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';
import {JobOrderRepository} from 'src/modules/jobOrder/jobOrder.repository';
import {CloseReasonArgumentsRepository} from 'src/modules/closeReasonArguments/closeReasonArguments.repository';
@Injectable()
export class JobCommandsService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly jobOrderRepository: JobOrderRepository,
    private readonly clientProfileRepository: ClientProfileRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly locationRepository: LocationRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly transformationsService: TransformationsService,
    private readonly closeReasonArgumentsRepository: CloseReasonArgumentsRepository,
  ) {}

  /**
   * Generate message payload for 'createContact' command
   *
   * @param {SalesForceCommands} commandName
   * @param {Tenant} tenant
   * @param {User} user
   * @param {UserProfile} userProfile
   * @param {TenantUser} tenantUser
   * @param {CreateContactAdditionalData} additionalData
   * @return {*}  {Promise<SalesForceCommand>}
   * @memberof UserCommandsService
   */
  public async getCreateJobCommand(
    commandName: string,
    tenant: Tenant,
    jobOrder: JobOrder,
  ): Promise<SalesForceCommand> {
    const clientProfile = jobOrder.clientId ? await this.clientProfileRepository.findOne(jobOrder.clientId) : null;
    const reportTo = jobOrder.reportToId ? await this.userProfileRepository.findOne(jobOrder.reportToId) : null;
    const createdBy = jobOrder.userId ? await this.userProfileRepository.findOne(jobOrder.userId) : null;
    const timeSheetApprover = jobOrder.timeSheetApproverId
      ? await this.userProfileRepository.findOne(jobOrder.timeSheetApproverId)
      : null;
    const location = jobOrder.locationId ? await this.locationRepository.findOneById(jobOrder.locationId) : null;
    const department = createdBy.departmentId
      ? await this.departmentRepository.findOneById(createdBy.departmentId)
      : null;

    let payload = {
      commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        jobId: jobOrder.id,
        clientInterviewMethod: 'none',
        externalCustomerId: clientProfile ? clientProfile.externalCustomerId : null,
        startTime: jobOrder.startTime,
        endTime: jobOrder.endTime,
        firstDayStartTime: jobOrder.startTime,
        jobDescription: jobOrder.jobDescription,
        name: jobOrder.name,
        branchCostCenter: clientProfile ? clientProfile.branchCostCenter : null,
        reportTo: reportTo ? reportTo.externalContactId : null,
        createdBy: createdBy ? createdBy.externalContactId : null,
        dateStart: dateFns.format(jobOrder.dateStart, 'yyyy-MM-dd'),
        // For JobOrders with permanent contract type the dateEnd property is null, as the contract does not have a specified end date
        dateEnd: jobOrder.dateEnd ? dateFns.format(jobOrder.dateEnd, 'yyyy-MM-dd') : null,
        numberOfOpenings: jobOrder.numberOfOpenings,
        externalLocationId: location?.externalLocationId ?? null,
        daysInWeek: jobOrder.daysInWeek ? jobOrder.daysInWeek.join(',') : null,
        timeSheetApprover: timeSheetApprover ? timeSheetApprover.externalContactId : null,
        department: department.name,
        additionalInformation: jobOrder.additionalInformation,
        contractRequired: clientProfile?.contractRequired ? 1 : 0,
      },

      keyValues: {
        country: tenant.country?.code,
        brand: tenant.brand,
        serviceTypeId: jobOrder.serviceTypeId,
        workTypeId: jobOrder.workTypeId,
        statusId: jobOrder.statusId,
        jobRoleId: jobOrder.jobRoleId,
      },
    };

    payload = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.createJob,
      payload,
      BusMessageTypeEnum.COMMAND,
    );

    return payload;
  }

  public async getUpdateJobCommand(commandName: string, tenant: Tenant, jobOrder: JobOrder) {
    const clientProfile = jobOrder.clientId ? await this.clientProfileRepository.findOne(jobOrder.clientId) : null;
    const reportTo = jobOrder.reportToId ? await this.userProfileRepository.findOne(jobOrder.reportToId) : null;
    const createdBy = jobOrder.userId ? await this.userProfileRepository.findOne(jobOrder.userId) : null;
    const timeSheetApprover = jobOrder.timeSheetApproverId
      ? await this.userProfileRepository.findOne(jobOrder.timeSheetApproverId)
      : null;
    const location = jobOrder.locationId ? await this.locationRepository.findOneById(jobOrder.locationId) : null;
    const department = createdBy.departmentId
      ? await this.departmentRepository.findOneById(createdBy.departmentId)
      : null;

    const closeReasonArguments = await this.closeReasonArgumentsRepository.findOne(tenant.id, jobOrder.id);

    let payload = {
      commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        jobId: jobOrder.id,
        externalJobId: jobOrder.externalId,
        clientInterviewMethod: 'none',
        externalCustomerId: clientProfile ? clientProfile.externalCustomerId : null,
        startTime: jobOrder.startTime,
        endTime: jobOrder.endTime,
        firstDayStartTime: jobOrder.startTime,
        jobDescription: jobOrder.jobDescription,
        name: jobOrder.name,
        payRate: jobOrder.salary,
        reportTo: reportTo ? reportTo.externalContactId : null,
        createdBy: createdBy ? createdBy.externalContactId : null,
        dateStart: dateFns.format(jobOrder.dateStart, 'yyyy-MM-dd'),
        // For JobOrders with permanent contract type the dateEnd property is null, as the contract does not have a specified end date
        dateEnd: jobOrder.dateEnd ? dateFns.format(jobOrder.dateEnd, 'yyyy-MM-dd') : null,
        numberOfOpenings: jobOrder.numberOfOpenings,
        externalLocationId: location?.externalLocationId ?? null,
        daysInWeek: jobOrder.daysInWeek ? jobOrder.daysInWeek.join(',') : null,
        timeSheetApprover: timeSheetApprover ? timeSheetApprover.externalContactId : null,
        department: department.name,
        additionalInformation: jobOrder.additionalInformation,
        contractRequired: clientProfile?.contractRequired ? 1 : 0,
      },

      keyValues: {
        country: tenant.country?.code,
        brand: tenant.brand,
        serviceTypeId: jobOrder.serviceTypeId,
        workTypeId: jobOrder.workTypeId,
        statusId: jobOrder.statusId,
        jobRoleId: jobOrder.jobRoleId,
        ...(closeReasonArguments && {reasonId: closeReasonArguments?.closeReasonId}),
      },
    };

    payload = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.createJob,
      payload,
      BusMessageTypeEnum.COMMAND,
    );

    return payload;
  }

  public async onCreateJobSuccess(busMessage: BusMessage) {
    try {
      const {response} = busMessage;
      const responseData = JSON.parse(response.Data);

      const {
        body: {
          brand,
          country,
          parameters: {jobId: jobOrderId},
        },
      } = busMessage.payload;
      // find tenant
      const tenant = await this.tenantService.getByBrandAndCountry(brand, country);
      if (!tenant) {
        throw new CommonIntegrationError.CountryBrandNotFound();
      }

      // find job order
      const existingJobOrder = await this.jobOrderRepository.findOne(
        tenant.id,
        jobOrderId,
        false, // dont include status data
        false, // dont include user data
        false, // dont consider 'isDisplayed' flag
        [],
      );
      if (!existingJobOrder) {
        throw new CommonIntegrationError.JobOrderNotFound();
      }

      existingJobOrder.externalId = responseData.changedEntityId;
      await this.jobOrderRepository.save(existingJobOrder);
    } catch (error) {
      throw new SalesForceError.SalesForceInvalidDataError({
        message: ' Chained command (JobOrderCreated) error',
      });
    }
  }
}
