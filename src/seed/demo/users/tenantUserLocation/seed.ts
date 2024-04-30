import {isEmpty} from 'lodash';
import {Connection} from 'typeorm';

import {UtilsHelper} from 'src/helpers/utils.helper';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {TenantUserLocationRepository} from 'src/modules/tenantUserLocation/tenantUserLocation.repository';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {Location} from 'src/modules/location/location.entity';
import {TenantUserLocationDto} from 'src/modules/tenantUserLocation/dto/tenantUserLocation.dto';

import {getLocationsByClient, isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {getTenantUsersLocations, getTenantUsersWithoutLocations} from './utils';

/**
 * Seed demo data for the TenantUserLocations in the system
 * We seed only Locations for the TenantUsers which don't have any assigned to them yet
 *
 * @param {Connection} db - The active connection with the database
 * @param {TenantUser[]} tenantUsers - List with all of the TenantUser for which we want to generate Locations
 * @param {Location[]} locations - List with all of the Locations for which we want to generate for the User
 * @returns {Promise<TenantUserLocation[]>} - A list with all of the seeded TenantUserLocations
 */
export const seedTenantUserLocations = async (
  db: Connection,
  tenantUsers: TenantUser[],
  locations: Location[],
): Promise<TenantUserLocation[]> => {
  log('Seeding TenantUser Locations', 3);
  const stopwatch = new Stopwatch();

  const tenantUsersWithoutLocations: TenantUser[] = await getTenantUsersWithoutLocations(db, tenantUsers);
  const tenantUserLocationSeedData: TenantUserLocationDto[] = generateTenantUserLocationSeed(
    tenantUsersWithoutLocations,
    locations,
  );

  const oldTenantUsersLocations: TenantUserLocation[] = await getTenantUsersLocations(db, tenantUsers);
  const createdTenantUserLocations: TenantUserLocation[] = await Promise.all(
    tenantUserLocationSeedData.map(async (data: TenantUserLocationDto) => {
      // TODO: Do we need this, check this, because it looks strange
      // await tenantUserLocationsRepository.deleteAllUsersLocations(data.tenantId, data.userId);

      return await seedTenantUserLocation(db, data);
    }),
  );

  const tenantUsersLocations: TenantUserLocation[] = [...oldTenantUsersLocations, ...createdTenantUserLocations];

  stopwatch.stopAndLogElapsedTime(`count: ${tenantUsersLocations.length}`);
  return tenantUsersLocations;
};

/**
 * Seed demo data for a TenantUserLocation
 *
 * @param {Connection} db - The active connection with the database
 * @param {TenantUserLocationDto} tenantUserLocationData - Data for the new record which should be created
 * @returns {Promise<TenantUserLocation>}
 */
export const seedTenantUserLocation = async (
  db: Connection,
  tenantUserLocationData: TenantUserLocationDto,
): Promise<TenantUserLocation> => {
  const isDebug = isDebugMode();
  const tenantUserLocationsRepository: TenantUserLocationRepository = db.getCustomRepository(
    TenantUserLocationRepository,
  );

  let tenantUserLocation: TenantUserLocation = await tenantUserLocationsRepository.findOne(
    tenantUserLocationData.tenantId,
    tenantUserLocationData.userId,
    tenantUserLocationData.locationId,
  );
  if (tenantUserLocation) {
    return tenantUserLocation;
  }

  tenantUserLocation = new TenantUserLocation();
  Object.assign(tenantUserLocation, tenantUserLocationData);

  logSuccess(
    `+ Seed TenantUserLocation [#${tenantUserLocation.locationId}] for User [#${tenantUserLocation.userId}]`,
    4,
    isDebug,
  );
  return await tenantUserLocationsRepository.save(tenantUserLocation);
};

/**
 * Generate some demo data for the TenantUserLocations
 *
 * @param {TenantUser[]} tenantUsers - List with all available TenantUsers for which we should generate Locations
 * @param {Location[]} locations - List with all Locations which should be associated with the Users
 * @returns {TenantUserLocationDto[]} - Generated data for the TenantUserPermissions
 */
export const generateTenantUserLocationSeed = (
  tenantUsers: TenantUser[],
  locations: Location[],
): TenantUserLocationDto[] => {
  let tenantUserLocationData: TenantUserLocationDto[] = [];

  tenantUsers.forEach((tenantUser: TenantUser) => {
    const locationsForClient = getLocationsByClient(locations, tenantUser.user.clientId);

    const tenantUserLocationsToCreate = [];
    locationsForClient.forEach((location) => {
      if (UtilsHelper.getRandomBoolean()) {
        return;
      }

      tenantUserLocationsToCreate.push({
        tenantId: tenantUser.tenantId,
        userId: tenantUser.userId,
        locationId: location.id,
      });
    });

    if (isEmpty(tenantUserLocationsToCreate)) {
      const locationId = UtilsHelper.getRandomItem(locationsForClient ?? [])?.id;
      if (locationId) {
        tenantUserLocationsToCreate.push({
          tenantId: tenantUser.tenantId,
          userId: tenantUser.userId,
          locationId,
        });
      }
    }

    tenantUserLocationData = [...tenantUserLocationData, ...tenantUserLocationsToCreate];
  });

  return tenantUserLocationData;
};
