import {IntegrationLogs} from './../../integrationLogging.service';
import {CommonIntegrationError} from '../../commonIntegration.error';
import {WorkplaceService} from './../../../workplace/workplace.service';
import {Injectable} from '@nestjs/common';
import {AccountCreatedData, AccountUpdatedData, InfoSystemEvent} from '../eventModels';
import {InfoSystemError} from '../infoSystem.error';
import {CountryService} from '../../../country/country.service';
import {ClientService} from '../../../client/client.service';
import {LocationService} from '../../../location/location.service';
import {LocationStatusEnum} from '../../../location/location.enum';
import {InfoUpdateClientDto} from 'src/modules/client/dto/infoUpdateClientDto';
import {InfoUpsertLocationDto} from 'src/modules/location/dto/infoUpsertLocation.dto';
import {InfoCreateClientDto} from 'src/modules/client/dto/infoCreateClientDto';
import {TenantService} from 'src/modules/tenant/tenant.service';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {GoogleApiService} from '../../../../modules/googleApi/googleApi.service';
import {TimeZoneResponse} from '@googlemaps/google-maps-services-js';
import {RecType} from 'src/modules/location/RecType.enum';
import {IntegrationSystemLogType, LogMessageType, ProcessingPlace} from '../../integrationSystem.enum';
import {EC_Transformations} from 'src/modules/transformations/eventsAndCommandsTransformations.data';
import {BusMessageTypeEnum} from 'src/modules/busMessage/busMessage.enum';
import {TransformationsService} from 'src/modules/transformations/transformation.service';

@Injectable()
export class LocationEventsService {
  public constructor(
    private readonly countryService: CountryService,
    private readonly clientService: ClientService,
    private readonly locationService: LocationService,
    private readonly workplaceService: WorkplaceService,
    private readonly tenantService: TenantService,
    private readonly utilsHelper: UtilsHelper,
    private readonly googleApiService: GoogleApiService,
    private readonly integrationLogs: IntegrationLogs,
    private readonly transformationsService: TransformationsService,
  ) {}

  private async saveWorkplace(event: InfoSystemEvent<AccountCreatedData> | InfoSystemEvent<AccountUpdatedData>) {
    // create/update Workplace
    if (event.parameters.recType === RecType.Workplace) {
      const {locationId, parentLocationId, workplaceStatus, workEnvironment} = event.parameters;

      if (!parentLocationId) {
        throw new InfoSystemError.WorksiteParentNotSpecified({workPlaceId: locationId, parentLocationId});
      }

      if (!workplaceStatus) {
        throw new InfoSystemError.WorksiteStatusNotExists({
          workPlaceId: locationId,
          parentLocationId,
        });
      }

      const parentLocation = await this.locationService.findOne(parentLocationId);
      if (!parentLocation) {
        throw new InfoSystemError.WorksiteParentNotExist({workPlaceId: locationId, parentLocationId});
      }

      await this.workplaceService.save({
        locationId,
        parentLocationId,
        status: workplaceStatus,
        workEnvironment,
      });
    }
  }

  public async onAccountCreated(event: InfoSystemEvent<AccountCreatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Location Created',
      event,
    );

    if (!event.parameters.locationId) {
      throw new InfoSystemError.LocationIdMissing();
    }

    const location = await this.locationService.findOne(event.parameters.locationId);
    if (location) {
      throw new InfoSystemError.LocationAlreadyExists();
    }

    if (!event.parameters.isMainLocation && !event.parameters.parentLocationId) {
      throw new InfoSystemError.LocationNotHQOrSite();
    }

    let clientId: string;

    if (event.parameters.isMainLocation) {
      const country = await this.countryService.findOneByCode(event.country);

      if (!country) {
        throw new CommonIntegrationError.CountryNotFound();
      }

      const tenants = await this.tenantService.findAllByCountryId(country.id);
      if (tenants.length == 0) {
        throw new CommonIntegrationError.CountryNotFound();
      }

      const clientData: InfoCreateClientDto = {
        countryId: country.id,
        name: event.parameters.locationName,
        clientInformation: {
          VAT: event.parameters.vat ? event.parameters.vat : null,
          businessName: event.parameters.businessName ? event.parameters.businessName : event.parameters.locationName,
          number: event.parameters.number ? event.parameters.number : null,
          phone: event.parameters.phone ? event.parameters.phone : null,
          phonePrefix: event.parameters.phonePrefix ? event.parameters.phonePrefix.replace(/\D/g, '') : null,
          email: event.parameters.email ? event.parameters.email : null,
          web: event.parameters.web ? event.parameters.web : null,
        },
      };

      const client = await this.clientService.createFromInfo(clientData);
      clientId = client.id;
    } else {
      const parentLocation = await this.locationService.findOne(event.parameters.parentLocationId);
      clientId = parentLocation.clientId;
    }

    // address coordinates
    let parsedCoords;
    if (event.parameters.street) {
      const address = `${event.parameters.city}, ${event.parameters.street} ${event.parameters.number}`;
      try {
        const coords = await this.googleApiService.googleGeocodeAddress(address);
        parsedCoords = coords && this.utilsHelper.parseCoords(coords, 'coords');
      } catch (e) {
        this.integrationLogs.generalErrorLog(
          __filename,
          IntegrationSystemLogType.InfoSystemIntegration,
          LogMessageType.Event,
          ProcessingPlace.CoordinatesError,
          'Get coordinates error - location created',
          e,
        );
      }
    }

    // address timezone
    let locationTimezone: TimeZoneResponse | void;
    if (parsedCoords) {
      try {
        locationTimezone = await this.googleApiService.googleTimezone(
          `${parsedCoords.lat},${parsedCoords.lng}`,
          Math.round(Date.now() / 1000),
        );
      } catch (e) {
        this.integrationLogs.generalErrorLog(
          __filename,
          IntegrationSystemLogType.InfoSystemIntegration,
          LogMessageType.Event,
          ProcessingPlace.TimezoneError,
          'Get timezone error - location created',
          e,
        );
      }
    }

    const locationData: InfoUpsertLocationDto = {
      clientId,
      id: event.parameters.locationId,
      city: event.parameters.city ? event.parameters.city : null,
      locationName: event.parameters.locationName,
      number: event.parameters.number,
      street: event.parameters.street ? event.parameters.street : null,
      zip: event.parameters.postalCode ? event.parameters.postalCode : null,
      country: event.parameters.country ? event.parameters.country : null,
      state: event.parameters.state ? event.parameters.state : null,
      isMainLocation: event.parameters.isMainLocation,
      status: event.parameters.status === 'Disabled' ? LocationStatusEnum.Disabled : LocationStatusEnum.Active,
      lat: parsedCoords?.lat ?? null,
      lng: parsedCoords?.lng ?? null,
      timezone: locationTimezone ? locationTimezone.data.timeZoneId : null,
    };

    await this.locationService.createFromInfo(locationData);

    await this.saveWorkplace(event);
  }

  public async onAccountUpdated(event: InfoSystemEvent<AccountUpdatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Location Updated',
      event,
    );

    if (!event.eventId) {
      throw new CommonIntegrationError.EventIdNotProvided();
    }

    const location = await this.locationService.findOne(event.parameters.locationId);
    if (!location) {
      throw new CommonIntegrationError.LocationNotFound();
    }

    if (event.parameters.isMainLocation) {
      const country = await this.countryService.findOneByCode(event.country);
      if (!country) {
        throw new CommonIntegrationError.CountryNotFound();
      }

      const tenants = await this.tenantService.findAllByCountryId(country.id);
      if (tenants.length == 0) {
        throw new CommonIntegrationError.CountryNotFound();
      }

      const clientData: InfoUpdateClientDto = {
        countryId: country.id,
        name: event.parameters.locationName,
        clientInformation: {
          VAT: event.parameters.vat,
          businessName: event.parameters.businessName || event.parameters.locationName,
          number: event.parameters.number,
          phone: event.parameters.phone,
          phonePrefix: event.parameters.phonePrefix.replace(/\D/g, ''),
          web: event.parameters.web,
        },
      };

      await this.clientService.updateFromInfo(location.clientId, clientData);
    }

    // address coordinates
    let parsedCoords;
    if (event.parameters.street) {
      const address = `${event.parameters.city}, ${event.parameters.street} ${event.parameters.number}`;
      try {
        const coords = await this.googleApiService.googleGeocodeAddress(address);
        parsedCoords = coords && this.utilsHelper.parseCoords(coords, 'coords');
      } catch (e) {
        this.integrationLogs.generalErrorLog(
          __filename,
          IntegrationSystemLogType.InfoSystemIntegration,
          LogMessageType.Event,
          ProcessingPlace.TimezoneError,
          'Get coordinates error - location updated',
          e,
        );
      }
    }

    // address timezone
    let locationTimezone: TimeZoneResponse | void;
    if (parsedCoords) {
      try {
        locationTimezone = await this.googleApiService.googleTimezone(
          `${parsedCoords.lat},${parsedCoords.lng}`,
          Math.round(Date.now() / 1000),
        );
      } catch (e) {
        this.integrationLogs.generalErrorLog(
          __filename,
          IntegrationSystemLogType.InfoSystemIntegration,
          LogMessageType.Event,
          ProcessingPlace.TimezoneError,
          'Get timezone error - location updated',
          e,
        );
      }
    }

    event.keyValues = {
      outOfBusiness: event.parameters.status,
    };

    const transformedEvent = await this.transformationsService.getPayloadWithTransformation(
      EC_Transformations.accountUpdated,
      event,
      BusMessageTypeEnum.EVENT,
    );

    const locationData: InfoUpsertLocationDto = {
      city: event.parameters.city,
      locationName: event.parameters.locationName,
      number: event.parameters.number,
      street: event.parameters.street,
      zip: event.parameters.postalCode,
      country: event.parameters.country,
      state: event.parameters.state,
      isMainLocation: event.parameters.isMainLocation,
      status:
        transformedEvent.parameters.status === 'Disabled' ? LocationStatusEnum.Disabled : LocationStatusEnum.Active,
      lat: parsedCoords?.lat ?? null,
      lng: parsedCoords?.lng ?? null,
      timezone: locationTimezone ? locationTimezone.data.timeZoneId : null,
    };

    const updatePromise = this.locationService.updateFromInfo(event.parameters.locationId, locationData);

    await Promise.all([updatePromise, this.saveWorkplace(event)]);
  }
}
