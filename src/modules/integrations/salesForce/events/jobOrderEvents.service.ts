import {SalesForceEvent} from './../eventModels/salesForceEvent';
import {SalesForceError} from './../salesForce.error';
import {IntegrationLogs} from './../../integrationLogging.service';
import {CommonIntegrationError} from '../../commonIntegration.error';
import * as dateFns from 'date-fns';
import {Injectable} from '@nestjs/common';
import {TenantService} from 'src/modules/tenant/tenant.service';
import {JobOrderService} from 'src/modules/jobOrder/jobOrder.service';
import {LocationService} from 'src/modules//location/location.service';
import {UpsertJobOrderDto} from 'src/modules/jobOrder/dto/upsertJobOrder.dto';
import {TransformationsService} from 'src/modules/transformations/transformation.service';
import {IntegrationSystemLogType} from '../../integrationSystem.enum';
import {ClientProfileService} from 'src/modules/clientProfile/clientProfile.service';
import {UserProfileService} from 'src/modules/userProfile/userProfile.service';
import {JobCreatedData} from '../eventModels/jobCreatedData';
import {EC_Transformations} from 'src/modules/transformations/eventsAndCommandsTransformations.data';
import {DaysInWeekEnum} from 'src/modules/jobOrder/jobOrder.enum';
import {capitalize} from 'lodash';

@Injectable()
export class JobOrderEventsService {
  public constructor(
    private readonly tenantService: TenantService,
    private readonly jobOrderService: JobOrderService,
    private readonly locationService: LocationService,
    private readonly transformationsService: TransformationsService,
    private readonly integrationLogs: IntegrationLogs,
    private readonly clientProfileService: ClientProfileService,
    private readonly userProfileService: UserProfileService,
  ) {}

  private formatDate(date: Date | null): Date | null {
    return date ? dateFns.toDate(date) : null;
  }

  private formatTime(date: string | null): string | null {
    return date ? dateFns.format(new Date(date), 'HH:mm:ss') : null;
  }

  private async getUserId(externalContactId: string | null, required: boolean = true): Promise<string | null> {
    if (!externalContactId) {
      if (required) {
        throw new CommonIntegrationError.UserNotFound();
      }
      return null;
    }

    const userId = (await this.userProfileService.findByExternalContactId(externalContactId))?.id ?? null;
    if (!userId) {
      throw new CommonIntegrationError.UserNotFound();
    }
    return userId;
  }

  public async onJobCreated(event: SalesForceEvent<JobCreatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      'JobOrder Created',
    );

    if (!event.eventId) {
      throw new CommonIntegrationError.EventIdNotProvided();
    }
    const {brand, country, parameters} = event;
    const {externalLocationId, externalCustomerId} = parameters ?? {};

    const tenant = await this.tenantService.getByBrandAndCountry(brand, country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const location = await this.locationService.findOneByExternalLocationId(externalLocationId);
    if (!location) {
      throw new CommonIntegrationError.LocationNotFound();
    }

    if (!externalCustomerId) {
      throw new SalesForceError.CustomerNotSpecified();
    }

    const clientProfile = await this.clientProfileService.getByExternalCustomerId(externalCustomerId);
    if (!clientProfile) {
      throw new SalesForceError.ClientNotFound();
    }

    event.keyValues = {
      brand: event.brand,
      country: event.country,
      workType: parameters.workType,
      recordTypeDeveloperName: parameters.serviceType?.toLowerCase(), // NAM is sending to CLP: 'Temp' (in the future this should be checked for some other service type)
      status: capitalize(parameters.status ?? ''),
      jobRole: parameters.jobRole,
    };

    const transformedEvent = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.jobCreatedNAM,
      event,
    );

    const jobOrderData: UpsertJobOrderDto = {
      id: parameters.jobId,
      externalId: parameters.externalJobId,
      workTypeId: transformedEvent.parameters?.workTypeId ?? null,
      clientId: clientProfile.id,
      endTime: this.formatTime(parameters.endTime),
      jobDescription: parameters.jobDescription,
      name: parameters.name,
      serviceTypeId: transformedEvent.parameters?.serviceTypeId ?? null,
      reportToId: await this.getUserId(parameters.reportTo),
      userId: await this.getUserId(parameters.createdBy),
      dateEnd: this.formatDate(parameters.dateEnd ? new Date(parameters.dateEnd) : null),
      dateStart: this.formatDate(parameters.dateStart ? new Date(parameters.dateStart) : null),
      startTime: this.formatTime(parameters.startTime),
      statusId: transformedEvent.parameters?.statusId ?? null,
      salary: parameters.payRate,
      numberOfOpenings: parameters?.numberOfOpenings ?? 0,
      locationId: location.id,
      daysInWeek:
        event.parameters?.daysInWeek?.split(',').map((day: string) => day.toLowerCase() as DaysInWeekEnum) ?? [],
      timeSheetApproverId: await this.getUserId(parameters.timeSheetApprover),
      // department: parameters.department, TO DO: missing column
      additionalInformation: parameters.additionalInformation,
      jobRoleId: transformedEvent.parameters?.jobRoleId ?? null,

      // default props
      submissionDate: this.formatDate(new Date()),
      interviewRequired: false,
      isDisplayed: true,
      experienceId: null,
      dayOneGuidance: null,
    };

    await this.jobOrderService.upsert(tenant.id, jobOrderData, true);
  }
}
