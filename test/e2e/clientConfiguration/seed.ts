import {getRepository, Repository} from 'typeorm';

import {serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';

import {testClientConfiguration} from '../clientConfiguration/data';
import {ClientConfiguration} from 'src/modules/clientConfiguration/clientConfiguration.entity';

export class ClientConfigurationDatabaseHelper implements DatabaseHelper {
  private clientConfigurationRepository: Repository<ClientConfiguration>;

  constructor() {
    this.clientConfigurationRepository = getRepository(ClientConfiguration);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Status records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await this.clientConfigurationRepository.save(testClientConfiguration);
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} clientConfigurationIds - A list with Status IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (clientConfigurationIds: string[]): Promise<void> => {
    if (!clientConfigurationIds || clientConfigurationIds.length === 0) {
      return;
    }

    const serializedFeatureConfigurationIds: string = serializeArrayAsSQLString(clientConfigurationIds);

    await this.clientConfigurationRepository.query(
      `DELETE FROM "ClientConfiguration" WHERE "id" IN (${serializedFeatureConfigurationIds});`,
    );
  };
}
