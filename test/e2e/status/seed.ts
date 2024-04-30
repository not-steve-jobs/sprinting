import {getRepository, Repository} from 'typeorm';

import {Status} from 'src/modules/status/status.entity';

import {serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';
import {testStatusesData} from './data';

export class StatusDatabaseHelper implements DatabaseHelper {
  private statusRepository: Repository<Status>;

  constructor() {
    this.statusRepository = getRepository(Status);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Status records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await this.statusRepository.save(testStatusesData);
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} statusIds - A list with Status IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (statusIds: string[] = []): Promise<void> => {
    if (!statusIds || statusIds.length === 0) {
      return;
    }

    const serializedStatusIds: string = serializeArrayAsSQLString(statusIds);

    await this.statusRepository.query(`DELETE FROM "Status" WHERE "id" IN (${serializedStatusIds});`);
  };
}
