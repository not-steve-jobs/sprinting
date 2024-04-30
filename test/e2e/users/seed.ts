import {getManager, getRepository, Repository} from 'typeorm';

import {createInsertQuery, serializeArrayAsSQLString} from '../utils/helpers';

import {DatabaseHelper} from '../utils/seed';
import {User} from 'src/modules/user/user.entity';
import {testUser} from './data';

export class UserDatabaseHelper implements DatabaseHelper {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Case Categories records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await getManager().query(createInsertQuery('User', testUser));
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} UserIDs - A list with Case IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (userIds: string[] = []): Promise<void> => {
    if (!userIds || userIds.length === 0) {
      return;
    }

    const serializedUserIds: string = serializeArrayAsSQLString(userIds);

    await this.userRepository.query(`DELETE FROM "User" WHERE "id" IN (${serializedUserIds});`);
  };
}
