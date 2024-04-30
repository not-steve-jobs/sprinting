import {getManager, getRepository, Repository} from 'typeorm';

import {createInsertQuery, serializeArrayAsSQLString} from '../utils/helpers';

import {DatabaseHelper} from '../utils/seed';
import {UserProfile} from 'src/modules/userProfile/userProfile.entity';
import {testUserProfile} from './data';

export class UserProfileDatabaseHelper implements DatabaseHelper {
  private userProfileRepository: Repository<UserProfile>;

  constructor() {
    this.userProfileRepository = getRepository(UserProfile);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific User Profile records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await getManager().query(createInsertQuery('UserProfile', testUserProfile));
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} tenantUserIds - A list with Case IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (userProfileIds: string[] = []): Promise<void> => {
    if (!userProfileIds || userProfileIds.length === 0) {
      return;
    }

    const serializedUserProfileIds: string = serializeArrayAsSQLString(userProfileIds);

    await this.userProfileRepository.query(`DELETE FROM "UserProfile" WHERE "id" IN (${serializedUserProfileIds});`);
  };
}
