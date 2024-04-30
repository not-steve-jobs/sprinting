import {getManager, getRepository, Repository} from 'typeorm';

import {createInsertQuery, serializeArrayAsSQLString} from '../utils/helpers';

import {DatabaseHelper} from '../utils/seed';
import {Country} from 'src/modules/country/country.entity';
import {testCountry} from './data';

export class CountryDatabaseHelper implements DatabaseHelper {
  private countryRepository: Repository<Country>;

  constructor() {
    this.countryRepository = getRepository(Country);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Country records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await getManager().query(createInsertQuery('Country', testCountry));
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} CountryIds - A list with Case IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (countryIds: string[] = []): Promise<void> => {
    if (!countryIds || countryIds.length === 0) {
      return;
    }

    const serializedCountryIds: string = serializeArrayAsSQLString(countryIds);

    await this.countryRepository.query(`DELETE FROM "Country" WHERE "id" IN (${serializedCountryIds});`);
  };
}
