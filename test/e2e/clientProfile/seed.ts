import {getRepository, Repository} from 'typeorm';

import {ClientProfile} from 'src/modules/clientProfile/clientProfile.entity';

import {serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';

import {testClientProfile} from '../clientProfile/data';

export class ClientProfileDatabaseHelper implements DatabaseHelper {
  private clientProfileRepository: Repository<ClientProfile>;

  constructor() {
    this.clientProfileRepository = getRepository(ClientProfile);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Client records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await this.clientProfileRepository.save(testClientProfile);
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} clientProfileIds - A list with Client IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (clientProfileIds: string[]): Promise<void> => {
    if (!clientProfileIds || clientProfileIds.length === 0) {
      return;
    }

    const serializedClientProfileIds: string = serializeArrayAsSQLString(clientProfileIds);

    await this.clientProfileRepository.query(
      `DELETE FROM "ClientProfile" WHERE "id" IN (${serializedClientProfileIds});`,
    );
  };
}
