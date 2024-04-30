import {getRepository, Repository} from 'typeorm';

import {Client} from 'src/modules/client/client.entity';

import {serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';

import {testChangedClient, testClient} from './data';

export class ClientDatabaseHelper implements DatabaseHelper {
  private clientRepository: Repository<Client>;

  constructor() {
    this.clientRepository = getRepository(Client);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Client records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await this.clientRepository.save([testClient, testChangedClient]);
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} clientIds - A list with Client IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (clientIds: string[] = []): Promise<void> => {
    if (!clientIds || clientIds.length === 0) {
      return;
    }

    const serializedClientIds: string = serializeArrayAsSQLString(clientIds);

    await this.clientRepository.query(`DELETE FROM "Client" WHERE "id" IN (${serializedClientIds});`);
  };
}
