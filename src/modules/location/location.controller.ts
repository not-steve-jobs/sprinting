import {Controller, Get, Param, Body, Post, ParseUUIDPipe, Patch, ParseIntPipe} from '@nestjs/common';
import {LocationService} from './location.service';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {LocationListingDto} from './dto/locationListing.dto';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {UpsertLocationDto} from './dto/upsertLocation.dto';
import {CognitiveSearchDto} from '../common/dto/CognitiveSearch.dto';
import {Pagination} from '../common/paginate';
import {Location} from './location.entity';
import {LocationDto} from './dto/location.dto';
import {ContextService} from 'src/core/context/context.service';

@ApiTags('Location')
@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService, private readonly contextService: ContextService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for Location search'})
  @Post('/clientId/:clientId/location/search')
  public async search(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() payload: LocationListingDto,
  ): Promise<Pagination<Location>> {
    return this.locationService.fetchLocations(
      clientId,
      {page: payload.page, itemsPerPage: payload.itemsPerPage},
      {sort: payload.sort},
      {filter: payload.filter},
    );
  }

  // TODO: Looks like this is no longer used, maybe we can remove it?
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for Location filter'})
  @Post('/tenant/:tenantId/clientId/:clientId/location/filter')
  public async cognitiveSearch(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() {term}: CognitiveSearchDto,
  ): Promise<Pagination<Location>> {
    return this.locationService.fetchLocationsCognitiveSearch(tenantId, clientId, term);
  }

  @Auth(AuthScopes.roleAdmin)
  @ApiOperation({summary: 'Handler for Location create'})
  //Todo: changed route:
  // @Post('/tenant/:tenantId/location/create')
  @Post('/location/create')
  async create(@Body() body: UpsertLocationDto): Promise<any> {
    return this.locationService.create(body);
  }

  @Auth(AuthScopes.roleAdmin)
  @ApiOperation({summary: 'Handler for Location update'})
  //Todo: changed route:
  // @Patch('/tenant/:tenantId/location/:locationId')
  @Patch('/location/:locationId')
  async update(@Param('locationId', ParseUUIDPipe) locationId: string, @Body() body: UpsertLocationDto): Promise<any> {
    return this.locationService.update(locationId, body);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving Locations by client id'})
  @Get('/clientId/:clientId/all-locations')
  public async fetchByClientId(@Param('clientId', ParseUUIDPipe) clientId: string): Promise<LocationDto[]> {
    return this.locationService.fetchByClientId(clientId, this.contextService.tenantUserContext.tenantUser, false);
  }
}
