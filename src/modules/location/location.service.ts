import {AuthRoles} from '../../core/auth/authRoles';
import {Injectable} from '@nestjs/common';
import {Location} from './location.entity';
import {LocationRepository} from './location.repository';
import {LocationDto} from './dto/location.dto';
import {FilteringOptionsLocations, Pagination, PaginationOptions, SortingOptions} from '../common/paginate';
import {UpsertLocationDto} from './dto/upsertLocation.dto';
import {LocationError} from './location.error';
import {AzureCognitiveSearchIndex} from '../azureCognitiveSearch/azureCognitiveSearchIndex.enum';
import {AzureCognitiveSearchService} from '../azureCognitiveSearch/azureCognitiveSearch.service';
import {DocumentAction} from '../azureCognitiveSearch/documentAction.enum';
import {LocationSearchDto} from './dto/locationSearch.dto';
import {LocationStatusEnum} from './location.enum';
import {DataProvidingEventsService} from '../integrations/dataProviding/dataProvidingEvents.service';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {InfoUpsertLocationDto} from './dto/infoUpsertLocation.dto';
import {SalesForceUpsertLocationDto} from './dto/salesForceUpsertLocation.dto';

@Injectable()
export class LocationService {
  constructor(
    private readonly LocationRepository: LocationRepository,
    private readonly azureCognitiveSearchService: AzureCognitiveSearchService,
    private readonly dataProvidingEventsService: DataProvidingEventsService,
  ) {}

  async findOne(locationId: string): Promise<LocationDto> {
    try {
      return await this.LocationRepository.findOne(locationId);
    } catch (error) {
      throw new LocationError.LocationsFetchError(null, error);
    }
  }

  async getClientMainLocation(clientId: string): Promise<LocationDto> {
    return this.LocationRepository.findClientMainLocation(clientId);
  }

  async findOneWithClient(locationId: string): Promise<LocationDto> {
    try {
      return await this.LocationRepository.findOneWithClient(locationId);
    } catch (error) {
      throw new LocationError.LocationsFetchError(null, error);
    }
  }

  async findOneByExternalLocationId(externalLocationId: string): Promise<LocationDto> {
    try {
      return await this.LocationRepository.findOneByExternalLocationId(externalLocationId);
    } catch (error) {
      throw new LocationError.LocationsFetchError(null, error);
    }
  }

  async fetchLocations(
    clientId: string,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptionsLocations,
  ): Promise<Pagination<Location>> {
    try {
      return await this.LocationRepository.fetchLocations(clientId, paginatorOptions, sortingOptions, filteringOptions);
    } catch (error) {
      throw new LocationError.LocationsFetchError(null, error);
    }
  }

  // TODO: Looks like this is no longer used, maybe we can remove it?
  async fetchLocationsCognitiveSearch(tenantId: number, clientId: string, term: string): Promise<Pagination<Location>> {
    try {
      return await this.azureCognitiveSearchService.fuzzyQuery(
        this.azureCognitiveSearchService.getIndexNameForTenant(AzureCognitiveSearchIndex.LOCATIONS, tenantId),
        `/.*${term}.*/`,
        {
          filter: `clientId eq '${clientId}'`,
          orderby: 'locationName desc,street desc,city desc,state desc',
        },
      );
    } catch (error) {
      throw new LocationError.LocationsFetchError(null, error);
    }
  }

  async createFromInfo(locationData: InfoUpsertLocationDto): Promise<LocationDto> {
    return this.createInternal(locationData);
  }

  async createFromSalesForce(locationData: SalesForceUpsertLocationDto): Promise<LocationDto> {
    return this.createInternal(locationData);
  }

  async create(locationData: UpsertLocationDto): Promise<LocationDto> {
    return this.createInternal(locationData);
  }

  private async createInternal(locationData: any): Promise<LocationDto> {
    try {
      const location = new Location(locationData);
      const savedLocation = await this.LocationRepository.save(location);
      // TODO: Fix
      // await this.azureCognitiveSearchService.createIndexIfNotExists(AzureCognitiveSearchIndex.LOCATIONS);
      // await this.upsertAzureCognitiveSearchData(savedLocation);
      await this.dataProvidingEventsService.sendClientLocationCreated(savedLocation);

      return {...savedLocation};
    } catch (error) {
      throw new LocationError.LocationCreateError(null, error);
    }
  }

  public async updateFromInfo(locationId: string, locationData: InfoUpsertLocationDto): Promise<LocationDto> {
    return this.updateInternal(locationId, locationData);
  }

  public async updateFromSalesForce(
    locationId: string,
    locationData: SalesForceUpsertLocationDto,
  ): Promise<LocationDto> {
    return this.updateInternal(locationId, locationData);
  }

  public async update(locationId: string, locationData: UpsertLocationDto): Promise<LocationDto> {
    return this.updateInternal(locationId, locationData);
  }

  private async updateInternal(locationId: string, locationData: any): Promise<LocationDto> {
    try {
      const location = new Location(locationData);
      location.id = locationId;
      if (locationData.disableLocation && location.status !== LocationStatusEnum.Disabled) {
        location.status = LocationStatusEnum.Disabled;
      }

      await this.LocationRepository.save(location);

      //for some reason LocationRepository.save doesn't return clientId in the location entity
      //get saved object with the findOne
      const savedLocation = await this.LocationRepository.findOne(locationId);

      await this.dataProvidingEventsService.sendClientLocationUpdated(savedLocation);

      // TODO: Fix
      //await this.azureCognitiveSearchService.createIndexIfNotExists(AzureCognitiveSearchIndex.LOCATIONS);
      //await this.upsertAzureCognitiveSearchData(savedLocation);

      return {...savedLocation};
    } catch (error) {
      throw new LocationError.LocationUpdateError(null, error);
    }
  }

  async updateMainLocation(clientId: string, locationData: UpsertLocationDto): Promise<LocationDto> {
    try {
      const location = new Location(locationData);
      const mainClientLocation = await this.LocationRepository.findClientMainLocation(clientId);
      location.id = mainClientLocation.id;

      const savedLocation = await this.LocationRepository.save(location);

      await this.dataProvidingEventsService.sendClientLocationUpdated(savedLocation);

      return {...savedLocation, id: mainClientLocation.id, isMainLocation: true};
    } catch (error) {
      throw new LocationError.LocationUpdateError(null, error);
    }
  }

  async fetchByClientId(
    clientId: string,
    tenantUser: TenantUser,
    includeWorkplaces: boolean = false,
  ): Promise<LocationDto[]> {
    try {
      let locations = await this.LocationRepository.fetchLocationsForClient(clientId, false, includeWorkplaces);

      locations = locations.map((location) => {
        const {
          id,
          isMainLocation,
          locationName,
          status,
          street,
          number,
          zip,
          city,
          lat,
          lng,
          timezone,
          workplace,
        } = location;
        const address = `${street} ${number}, ${zip} ${city}`;

        return {id, isMainLocation, locationName, status, address, lat, lng, timezone, workplace};
      });
      if (!AuthRoles.isAdmin(tenantUser.roleId)) {
        locations = locations.filter((location) => {
          return !!tenantUser.tenantUserLocations.find((tLocation) => tLocation.locationId === location.id);
        });
      }
      return locations;
    } catch (error) {
      throw new LocationError.LocationsFetchError(null, error);
    }
  }

  async upsertAzureCognitiveSearchData(savedLocation: Location, tenantId?: number) {
    await this.azureCognitiveSearchService.createIndexIfNotExists(AzureCognitiveSearchIndex.LOCATIONS, tenantId);

    const dataForAzure = new LocationSearchDto(savedLocation);

    await this.azureCognitiveSearchService.postData(
      this.azureCognitiveSearchService.getIndexNameForTenant(AzureCognitiveSearchIndex.LOCATIONS, tenantId),
      DocumentAction.MERGE_OR_UPLOAD,
      [dataForAzure],
    );
  }
}
