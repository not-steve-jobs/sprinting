import {CommonIntegrationError} from '../../commonIntegration.error';
import {Injectable} from '@nestjs/common';
import {
  BranchAccountCreatedData,
  BranchAccountUpdatedData,
  BranchCreatedData,
  BranchUpdatedData,
  InfoSystemEvent,
} from '../eventModels';
import {InfoSystemError} from '../infoSystem.error';
import {TenantService} from '../../../tenant/tenant.service';
import {BranchService} from '../../../branch/branch.service';
import {LocationBranchService} from '../../../locationBranch/locationBranch.service';
import {InfoUpdateBranchDto} from 'src/modules/branch/dto/infoUpdateBranch.dto';
import {InfoCreateBranchDto} from 'src/modules/branch/dto/infoCreateBranch.dto';
import {InfoCreateLocationBranchDto} from 'src/modules/locationBranch/dto/infoCreateLocationBranch.dto';
import {InfoUpdateLocationBranchDto} from 'src/modules/locationBranch/dto/infoUpdateLocationBranch.dto';
import {LocationService} from 'src/modules/location/location.service';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {IntegrationLogs} from '../../integrationLogging.service';
import {IntegrationSystemLogType} from '../../integrationSystem.enum';

@Injectable()
export class BranchEventsService {
  public constructor(
    private readonly tenantService: TenantService,
    private readonly branchService: BranchService,
    private readonly locationBranchService: LocationBranchService,
    private readonly locationService: LocationService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async onBranchCreated(event: InfoSystemEvent<BranchCreatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Branch Created',
    );

    if (!event.eventId) {
      throw new CommonIntegrationError.EventIdNotProvided();
    }

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const branchData: InfoCreateBranchDto = {
      id: event.parameters.id,
      tenantId: tenant.id,
      name: event.parameters.name,
      status: event.parameters.status,
      branchCostCenter: event?.parameters?.costCenter ?? null,
    };

    await this.branchService.createFromInfo(branchData);
  }

  public async onBranchUpdated(event: InfoSystemEvent<BranchUpdatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Branch Updated',
    );

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const branchData: InfoUpdateBranchDto = {
      id: event.parameters.id,
      tenantId: tenant.id,
      name: event.parameters.name,
      status: event.parameters.status,
      branchCostCenter: event?.parameters?.costCenter ?? null,
    };

    await this.branchService.updateFromInfo(branchData.id, branchData);
  }

  public async onBranchAccountCreated(event: InfoSystemEvent<BranchAccountCreatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Branch Account Created',
    );

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const location = await UtilsHelper.retry(
      async () => this.locationService.findOne(event.parameters.locationId),
      3,
      1000,
    );
    if (!location) {
      throw new CommonIntegrationError.LocationNotFound();
    }

    const branch = await UtilsHelper.retry(
      async () => this.branchService.findOne(tenant.id, event.parameters.branchId),
      3,
      1000,
    );
    if (!branch) {
      throw new InfoSystemError.BranchNotFound();
    }

    const locationBranchData: InfoCreateLocationBranchDto = {
      branchId: event.parameters.branchId,
      tenantId: tenant.id,
      locationId: event.parameters.locationId,
      inTerritory: event.parameters.inTerritory,
    };

    await this.locationBranchService.createFromInfo(locationBranchData);
  }

  public async onBranchAccountUpdated(event: InfoSystemEvent<BranchAccountUpdatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Branch Account Updated',
    );

    if (!event.eventId) {
      throw new CommonIntegrationError.EventIdNotProvided();
    }

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const locationBranchData: InfoUpdateLocationBranchDto = {
      branchId: event.parameters.branchId,
      tenantId: tenant.id,
      locationId: event.parameters.locationId,
      inTerritory: event.parameters.inTerritory,
    };

    await this.locationBranchService.updateFromInfo(locationBranchData);
  }
}
