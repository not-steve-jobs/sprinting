import {getRepository, Repository} from 'typeorm';

import {serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';

import {BusMessage} from '../../../src/modules/busMessage/busMessage.entity';

export class BusMessageDatabaseHelper implements DatabaseHelper {
  private busMessageRepository: Repository<BusMessage>;

  constructor() {
    this.busMessageRepository = getRepository(BusMessage);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Bus Message records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    return;
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} busMessageIds - A list with Bus Message IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (busMessageIds: string[] = []): Promise<void> => {
    if (!busMessageIds || busMessageIds.length === 0) {
      return;
    }

    const serializedBusMessageIds: string = serializeArrayAsSQLString(busMessageIds);

    await this.busMessageRepository.query(`DELETE FROM "BusMessage" WHERE "id" IN (${serializedBusMessageIds});`);
  };
}
