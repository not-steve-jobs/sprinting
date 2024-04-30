import {Permission} from 'src/modules/permission/permission.entity';
import {getManager, getRepository, Repository} from 'typeorm';
import {createInsertQuery, serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';
import {testChangedPermission, testPermission} from './data';

export class PermissionDatabaseHelper implements DatabaseHelper {
  private permissionsRepository: Repository<Permission>;

  constructor() {
    this.permissionsRepository = getRepository(Permission);
  }

  /**
   * Prepare the database for the e2e tests by seeding Permission records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await getManager().query(createInsertQuery('Permission', testPermission));
    await getManager().query(createInsertQuery('Permission', testChangedPermission));
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} PermissionIds - A list with Permission IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (permissionIds: string[]): Promise<void> => {
    if (!permissionIds || permissionIds.length === 0) return;
    const serializedPermissionIds: string = serializeArrayAsSQLString(permissionIds);
    await this.permissionsRepository.query(`DELETE FROM "Permission" WHERE "id" IN (${serializedPermissionIds});`);
  };
}
