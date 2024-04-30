import {CommonIntegrationError} from '../../commonIntegration.error';
import {Injectable} from '@nestjs/common';
import {CountryService} from 'src/modules/country/country.service';
import {TenantService} from 'src/modules/tenant/tenant.service';
import {SalesForceEvent} from '../eventModels';
import {AccountCreatedData} from '../eventModels/accountCreatedData';
import {v4 as uuid} from 'uuid';
import {LocationStatusEnum} from 'src/modules/location/location.enum';
import {TimeZoneResponse} from '@googlemaps/google-maps-services-js';
import {GoogleApiService} from 'src/modules/googleApi/googleApi.service';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {SalesForceUpsertLocationDto} from 'src/modules/location/dto/salesForceUpsertLocation.dto';
import {LocationService} from 'src/modules/location/location.service';
import {ClientProfileService} from 'src/modules/clientProfile/clientProfile.service';
import {SalesForceError} from '../salesForce.error';
import {AccountUpdatedData} from '../eventModels/accountUpdatedData';
import {IntegrationSystemLogType, LogMessageType, ProcessingPlace} from '../../integrationSystem.enum';
import {IntegrationLogs} from '../../integrationLogging.service';
import {LocationStatus} from '../eventModels/salesForceStatuses.enum';

@Injectable()
export class LocationEventsService {
  public constructor(
    private readonly countryService: CountryService,
    private readonly tenantService: TenantService,
    private readonly googleApiService: GoogleApiService,
    private readonly utilsHelper: UtilsHelper,
    private readonly locationService: LocationService,
    private readonly clientProfileService: ClientProfileService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async onAccountCreated(event: SalesForceEvent<AccountCreatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      'Account Created',
      event,
    );

    const country = await this.countryService.findOneByCode(event.country);

    if (!country) {
      throw new CommonIntegrationError.CountryNotFound();
    }

    const tenants = await this.tenantService.findAllByCountryId(country.id);
    if (tenants.length == 0) {
      throw new CommonIntegrationError.CountryNotFound();
    }

    // address coordinates
    const parsedCoords = await this.parseCoords(event);

    // address timezone
    let locationTimezone: TimeZoneResponse | void;
    if (parsedCoords) {
      locationTimezone = await this.getTimezone(parsedCoords);
    }

    const client = await this.clientProfileService.getByExternalCustomerId(event.parameters.externalCustomerId);

    if (!client) {
      throw new SalesForceError.ClientNotFound();
    }

    const locationData: SalesForceUpsertLocationDto = {
      id: uuid(),
      externalLocationId: event.parameters.externalLocationId,
      clientId: client.id,
      locationName: event.parameters.locationName,
      city: event.parameters.city ?? null,
      country: event.parameters.countryCode ?? null,
      state: event.parameters.state ?? null,
      street: event.parameters.street ?? null,
      street2: event.parameters.street2 ?? null,
      zip: event.parameters.zip ?? null,
      status:
        event.parameters.status === LocationStatus.Inactive ? LocationStatusEnum.Disabled : LocationStatusEnum.Active,
      lat: parsedCoords?.lat ?? null,
      lng: parsedCoords?.lng ?? null,
      timezone: locationTimezone ? locationTimezone.data.timeZoneId : null,
      orderOwningOffice: event.parameters.orderOwningOffice ?? null,
      employeeOwningOffice: event.parameters.employeeOwningOffice ?? null,
      billToExternalContactId: event.parameters.billToExternalContactId ?? null,
    };

    await this.locationService.createFromSalesForce(locationData);
  }
  public async onAccountUpdated(event: SalesForceEvent<AccountUpdatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      'Account Updated',
      event,
    );

    if (!event.eventId) {
      throw new CommonIntegrationError.EventIdNotProvided();
    }

    const location = await this.locationService.findOneByExternalLocationId(event.parameters.externalLocationId);
    if (!location) {
      throw new CommonIntegrationError.LocationNotFound();
    }

    const country = await this.countryService.findOneByCode(event.country);

    if (!country) {
      throw new CommonIntegrationError.CountryNotFound();
    }

    const tenants = await this.tenantService.findAllByCountryId(country.id);
    if (tenants.length == 0) {
      throw new CommonIntegrationError.CountryNotFound();
    }

    // address coordinates
    const parsedCoords = await this.parseCoords(event);

    // address timezone
    let locationTimezone: TimeZoneResponse | void;
    if (parsedCoords) {
      locationTimezone = await this.getTimezone(parsedCoords);
    }

    const client = await this.clientProfileService.getByExternalCustomerId(event.parameters.externalCustomerId);

    if (!client) {
      throw new SalesForceError.ClientNotFound();
    }

    const locationData: SalesForceUpsertLocationDto = {
      externalLocationId: event.parameters.externalLocationId,
      clientId: client.id,
      locationName: event.parameters.locationName,
      city: event.parameters.city ?? null,
      country: event.parameters.countryCode ?? null,
      state: event.parameters.state ?? null,
      street: event.parameters.street ?? null,
      street2: event.parameters.street2 ?? null,
      zip: event.parameters.zip ?? null,
      status:
        event.parameters.status === LocationStatus.Inactive ? LocationStatusEnum.Disabled : LocationStatusEnum.Active,
      lat: parsedCoords?.lat ?? null,
      lng: parsedCoords?.lng ?? null,
      timezone: locationTimezone ? locationTimezone.data.timeZoneId : null,
      orderOwningOffice: event.parameters.orderOwningOffice ?? null,
      employeeOwningOffice: event.parameters.employeeOwningOffice ?? null,
      billToExternalContactId: event.parameters.billToExternalContactId ?? null,
    };

    await this.locationService.updateFromSalesForce(location.id, locationData);
  }

  public async parseCoords(event: SalesForceEvent<AccountCreatedData>) {
    let parsedCoords;
    if (event.parameters.street) {
      const address = `${event.parameters.city}, ${event.parameters.street}`;
      try {
        const coords = await this.googleApiService.googleGeocodeAddress(address);
        if (coords) {
          parsedCoords = this.utilsHelper.parseCoords(coords, 'coords');
        }
        return parsedCoords;
      } catch (e) {
        this.integrationLogs.generalErrorLog(
          __filename,
          IntegrationSystemLogType.SalesForceIntegration,
          LogMessageType.Event,
          ProcessingPlace.CoordinatesError,
          'Get coordinates error - account created/updated',
          e,
        );
      }
    }
  }

  public async getTimezone(parsedCoords) {
    let locationTimezone;
    try {
      locationTimezone = await this.googleApiService.googleTimezone(
        `${parsedCoords.lat},${parsedCoords.lng}`,
        Math.round(Date.now() / 1000),
      );
      return locationTimezone;
    } catch (e) {
      this.integrationLogs.generalErrorLog(
        __filename,
        IntegrationSystemLogType.SalesForceIntegration,
        LogMessageType.Event,
        ProcessingPlace.TimezoneError,
        'Get timezone error - account created/updated',
        e,
      );
    }
  }
}
