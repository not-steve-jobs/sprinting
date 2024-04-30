import {Connection} from 'typeorm/connection/Connection';

import {intGuid, getRandomIntIndex, log, logSuccess, isDebugMode} from 'src/seed/utils/seed.utils';
import {LocationStatusEnum} from 'src/modules/location/location.enum';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {Client} from 'src/modules/client/client.entity';
import {LocationRepository} from 'src/modules/location/location.repository';
import {Location} from 'src/modules/location/location.entity';
import {LocationDto} from 'src/modules/location/dto/location.dto';

import {Stopwatch} from 'src/seed/utils/stopwatch';
import {
  DEMO_CITIES,
  DEMO_COUNTRIES,
  DEMO_LOCATION_NAMES,
  DEMO_NUMBERS,
  DEMO_STATES,
  DEMO_LOCATION_STATUSES,
  DEMO_STREETS,
  DEMO_ZIP_CODES,
} from './data';

/**
 * Seed demo data for the Locations in the system
 *
 * @param {Connection} db - The active connection with the database
 * @param {Client[]} clients - List with all of the Clients we want to use for the Locations
 * @returns {Promise<Location[]>} - A list with all of the seeded Locations
 */
export const seedLocations = async (db: Connection, clients: Client[]): Promise<Location[]> => {
  log('Seeding Locations');
  const stopwatch = new Stopwatch();

  const locationsData: LocationDto[] = generateLocationSeedData(clients);
  const createdLocations: Location[] = await Promise.all(
    locationsData.map(async (data: LocationDto) => {
      return await seedLocation(db, data);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdLocations.length}`);
  return createdLocations;
};

/**
 * Seed demo data for a Location
 *
 * @param {Connection} db - The active connection with the database
 * @param {LocationDto} locationData - All of the data which should be associated with the Location
 * @param {boolean} isDebug - Control the output log
 * @returns {Promise<Location>}
 */
export const seedLocation = async (
  db: Connection,
  locationData: LocationDto,
  isDebug: boolean = false,
): Promise<Location> => {
  isDebug = isDebug ?? isDebugMode();
  const locationRepository: LocationRepository = db.getCustomRepository(LocationRepository);

  let location: Location = await locationRepository.findOne(locationData.id);
  if (location) {
    return location;
  }

  location = new Location();
  Object.assign(location, locationData);

  logSuccess(`+ Seed Location [#${location.id}] ${location.locationName}`, 3, isDebug);
  return locationRepository.save(location);
};

/**
 * Generate some demo Locations data
 * Note: Split the generation of the dto in a separate function
 *
 * @param {Client[]} clients - List with Clients which should be used to generate Locations
 * @returns {LocationDto[]} - Generated details for Locations
 */
export const generateLocationSeedData = (clients: Client[]): LocationDto[] => {
  const locationData: LocationDto[] = [];
  const maxLocation = 10;

  clients.forEach(({id: clientId}, clientIndex) => {
    const randomMainLocation = getRandomIntIndex(maxLocation);

    for (let i = 0; i < maxLocation; i++) {
      // TODO: Move out the generation of a single Branch in a separate function
      const _clientIdSuffix = clientId.split('-')[clientId.split('-').length - 1];
      locationData.push({
        id: intGuid(maxLocation * (clientIndex + 1) + i),
        clientId,
        isMainLocation: randomMainLocation === i,
        locationName: `${DEMO_LOCATION_NAMES[i]} - ${_clientIdSuffix}-${i}`,
        street: DEMO_STREETS[i],
        number: DEMO_NUMBERS[i],
        city: DEMO_CITIES[i],
        state: DEMO_STATES[i],
        country: DEMO_COUNTRIES[i],
        zip: DEMO_ZIP_CODES[i],
        status:
          randomMainLocation === i ? LocationStatusEnum.Active : UtilsHelper.getRandomItem(DEMO_LOCATION_STATUSES),
        lat: 48.8693856,
        lng: 2.3071806,
        timezone: 'America/Los_Angeles',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  });

  return locationData;
};
