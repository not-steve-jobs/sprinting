import {uniqBy} from 'lodash';
import {Connection} from 'typeorm';

import {Location} from 'src/modules/location/location.entity';
import {Workplace} from 'src/modules/workplace/workplace.entity';
import {WorkplaceRepository} from 'src/modules/workplace/workplace.repository';
import {WorkplaceCreateDto} from 'src/modules/workplace/dto/workplaceCreate.dto';
import {LocationDto} from 'src/modules/location/dto/location.dto';

import {getRandomItem} from 'src/seed/utils/helpers';
import {DEMO_WORK_PLACE_STATUSES} from './data';
import {seedLocation} from '../location/';
import {isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {Stopwatch} from 'src/seed/utils/stopwatch';

/**
 * Seed demo Workplaces
 *
 * @param {Connection} db - The active connection with the database
 * @param {Location[]} locations - The Locations for which we have to seed Workplaces
 * @returns {Promise<Workplace[]>}
 */
export const seedWorkplaces = async (db: Connection, locations: Location[]): Promise<Workplace[]> => {
  log('Seeding Workplaces');
  const stopwatch = new Stopwatch();

  const clientLocations: Location[] = uniqBy(locations, 'clientId');

  const createdWorkplaces: Workplace[] = await Promise.all(
    clientLocations.map((location) => {
      return seedClientWorkplace(db, location);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdWorkplaces.length}`);
  return createdWorkplaces;
};

/**
 * Seed demo Workplace for a specific Location
 *
 * @param {Connection} db - The active connection with the database
 * @param {Location} location - The Location which contain details for the Workplace
 * @returns {Promise<Workplace>}
 */
const seedClientWorkplace = async (db: Connection, location: Location): Promise<Workplace> => {
  const workplaceRepository: WorkplaceRepository = db.getCustomRepository(WorkplaceRepository);

  const locationWorkplaces: Workplace[] = await workplaceRepository.getAll(location.id);
  if (locationWorkplaces.length > 0) {
    return locationWorkplaces[0];
  }

  // Create a copy of the original location which will be used by the workplace
  const workplaceLocation: Location = {...location};
  workplaceLocation.id = `1${location.id.substring(1)}`;
  workplaceLocation.locationName += ` - Workplace`;

  const workplaceData: WorkplaceCreateDto = generateWorkplaceData(location, workplaceLocation);

  return await seedWorkplace(db, workplaceLocation, workplaceData);
};

/**
 * Seed demo Workplace
 *
 * @param {Connection} db - The active connection with the database
 * @param {LocationDto} locationData - The data related with the Location of the Workplace
 * @param {WorkplaceCreateDto} workplaceData - The data related with the Workplace
 * @returns {Promise<Workplace>}
 */
const seedWorkplace = async (
  db: Connection,
  locationData: LocationDto,
  workplaceData: WorkplaceCreateDto,
): Promise<Workplace> => {
  const isDebug = isDebugMode();
  const workplaceRepository: WorkplaceRepository = db.getCustomRepository(WorkplaceRepository);

  const workplace: Workplace = await workplaceRepository.findOne(workplaceData.locationId, locationData.id);
  if (workplace) {
    return workplace;
  }

  await seedLocation(db, locationData, false);
  const newWorkplace: Workplace = new Workplace(workplaceData);

  logSuccess(`+ Seed Workplace [#${newWorkplace.locationId}]`, 3, isDebug);
  return await workplaceRepository.save(newWorkplace);
};

/**
 * Generate demo data for a Workplace
 *
 * @param {Location} parentLocation - The parent of the Workplace
 * @param {Location} location - The Location which contain details for the Workplace
 * @returns {WorkplaceCreateDto}
 */
const generateWorkplaceData = (parentLocation: Location, location: Location): WorkplaceCreateDto => {
  return {
    locationId: location.id,
    parentLocationId: parentLocation.id,
    status: getRandomItem(DEMO_WORK_PLACE_STATUSES),
    workEnvironment: 'workEnvironment',
    wifiId: 'testWIFI',
    qrCode: 'qrCode',
  };
};
