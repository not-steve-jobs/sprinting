import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Location} from './location.entity';
import {Pagination, PaginationOptions, SortingOptions, FilteringOptionsLocations} from '../common/paginate';
import {LocationStatusEnum} from './location.enum';
import {PlainObject} from '../common/common.dto';

@EntityRepository(Location)
export class LocationRepository extends AbstractRepository<Location> {
  private q(): SelectQueryBuilder<Location> {
    return this.createQueryBuilder('Location');
  }
  public async findAll(): Promise<Location[]> {
    return this.q().getMany();
  }

  public async findOne(id: string): Promise<Location> {
    return this.manager.findOne(Location, {
      where: {
        id,
      },
    });
  }

  public async findOneWithClient(id: string): Promise<Location> {
    return this.manager.findOne(Location, {
      where: {
        id,
      },
      relations: ['client'],
    });
  }

  public async findOneById(id: string): Promise<Location> {
    return this.q().andWhere('"id" = :id', {id}).getOne();
  }

  public async findOneByExternalLocationId(externalLocationId: string): Promise<Location> {
    return this.q().andWhere('"externalLocationId" = :externalLocationId', {externalLocationId}).getOne();
  }

  public async findClientMainLocation(clientId: string): Promise<Location> {
    return this.q()
      .andWhere('"clientId" = :clientId', {clientId})
      .andWhere('"isMainLocation" = true')
      .orderBy('id', 'ASC')
      .getOne();
  }

  private parseLocations(locations: Location[]): Location[] {
    return locations.map((location: Location) => this.parseLocation(location));
  }

  private parseLocation(location: Location): any {
    return {
      ...location,
      _address: `${location.street} ${location.number} ${location.zip} ${location.city} ${location.country}`,
    };
  }

  public async fetchLocations(
    clientId: string,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptionsLocations,
  ): Promise<Pagination<Location>> {
    const {locationSearchQuery, status} = filteringOptions.filter || {};
    const {itemsPerPage, page} = paginatorOptions || {};

    const query = this.q().andWhere('"clientId" = :clientId', {clientId});

    if (locationSearchQuery) {
      query.andWhere(
        `(LOWER("locationName") LIKE :searchTerm
                        OR LOWER("street") LIKE :searchTerm
                        OR LOWER("number") LIKE :searchTerm
                        OR LOWER("city") LIKE :searchTerm
                        OR LOWER("state") LIKE :searchTerm
                        OR LOWER("country") LIKE :searchTerm
                        OR LOWER("zip") LIKE :searchTerm)`,
        {
          searchTerm: `%${locationSearchQuery.toLowerCase()}%`,
        },
      );
    }

    if (status) {
      query.andWhere('"status" = :status', {status});
    }

    query
      .orderBy('"locationName"', 'ASC')
      .addOrderBy('"street"', 'ASC')
      .addOrderBy('"number"', 'ASC')
      .addOrderBy('"city"', 'ASC')
      .addOrderBy('"state"', 'ASC')
      .addOrderBy('"country"', 'ASC')
      .addOrderBy('"zip"', 'ASC')
      .take(itemsPerPage)
      .skip((page - 1) * itemsPerPage);

    const total = await query.clone().getCount();
    const results = await query.getMany();

    return new Pagination<Location>({
      results: this.parseLocations(results),
      total,
    });
  }

  public async save(entity: Location) {
    return this.manager.save(entity);
  }

  public async delete(entity: Location) {
    return this.manager.remove(entity);
  }

  public async update(id: string, payload: PlainObject) {
    return await this.q().andWhere('"id" = :id', {id}).update(payload).execute();
  }

  public async fetchLocationsForClient(
    clientId: string,
    includeAllLocations = false,
    includeWorkplaces: boolean = false,
  ): Promise<any> {
    let query = this.q().andWhere('"clientId" = :clientId', {clientId}).orderBy('id', 'ASC');
    query = query.leftJoinAndSelect('Location.workplace', 'Workplace');
    if (!includeAllLocations) {
      query.andWhere('"Location"."status" not like :statusName', {statusName: LocationStatusEnum.New});
    }
    if (!includeWorkplaces) {
      query.andWhere('"Workplace" IS null');
    }
    query = query.orderBy('"Location"."id"', 'ASC');
    return query.getMany();
  }

  public async findWithoutCoords(): Promise<Location[]> {
    return this.q().where('"lat" IS null').andWhere('"lng" IS null').getMany();
  }

  public async findWithoutTimezone(): Promise<Location[]> {
    return this.q().where('"timezone" IS null').getMany();
  }
}
