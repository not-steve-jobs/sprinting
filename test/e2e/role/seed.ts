import {getRepository, Repository} from 'typeorm';

import {serializeArrayAsSQLString} from '../utils/helpers';

import {DatabaseHelper} from '../utils/seed';
import {Role} from 'src/modules/role/role.entity';

export class RoleDatabaseHelper implements DatabaseHelper {
  private roleRepository: Repository<Role>;

  constructor() {
    this.roleRepository = getRepository(Role);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Case Categories records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    // TODO: Enable this when #2726 is done
    // await Promise.all(
    //   testRoleData.map(async (role) => {
    //     return await getManager().query(createInsertQuery('Role', role));
    //   }),
    // );
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} RoleIds - A list with Case IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (roleIds: string[] = []): Promise<void> => {
    if (!roleIds || roleIds.length === 0) {
      return;
    }

    const serializedRoleIds: string = serializeArrayAsSQLString(roleIds);

    await this.roleRepository.query(`DELETE FROM "Role" WHERE "id" IN (${serializedRoleIds});`);
  };
}
