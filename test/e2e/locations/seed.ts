import {getRepository, Repository} from 'typeorm';

import {Location} from 'src/modules/location/location.entity';

import {serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';

import {testChangedLocation, testLocation} from './data';

export class LocationDatabaseHelper implements DatabaseHelper {
  private locationRepository: Repository<Location>;

  constructor() {
    this.locationRepository = getRepository(Location);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Location records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await this.locationRepository.save([testLocation, testChangedLocation]);
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} locationIds - A list with Location IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (locationIds: string[] = []): Promise<void> => {
    if (!locationIds || locationIds.length === 0) {
      return;
    }

    const serializedLocationIds: string = serializeArrayAsSQLString(locationIds);

    await this.locationRepository.query(`DELETE FROM "Location" WHERE "id" IN (${serializedLocationIds});`);
  };
}
