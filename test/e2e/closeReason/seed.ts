import {getRepository, Repository} from 'typeorm';
import {createInsertQuery, serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';
import {CloseReason} from 'src/modules/closeReason/closeReason.entity';
import {testCloseReasons} from './data';

export class CloseReasonDatabaseHelper implements DatabaseHelper {
  private closeReasonRepository: Repository<CloseReason>;

  constructor() {
    this.closeReasonRepository = getRepository(CloseReason);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Close reason records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await this.closeReasonRepository.query(createInsertQuery('CloseReason', testCloseReasons));
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} closeReasonIds - A list with Close reason IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (closeReasonIds: string[] = []): Promise<void> => {
    if (!closeReasonIds || closeReasonIds.length === 0) {
      return;
    }
    const serializedcloseReasonIds: string = serializeArrayAsSQLString(closeReasonIds);
    await this.closeReasonRepository.query(`DELETE FROM "CloseReason" WHERE "id" IN (${serializedcloseReasonIds});`);
  };
}
