import {getManager, getRepository, Repository} from 'typeorm';

import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';

import {createInsertQuery} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';
import {testTenantUser} from './data';

export class TenantUserDatabaseHelper implements DatabaseHelper {
  private tenantUserRepository: Repository<TenantUser>;

  constructor() {
    this.tenantUserRepository = getRepository(TenantUser);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Tenant User records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await getManager().query(createInsertQuery('TenantUser', testTenantUser));
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {Pick<TenantUser, 'tenantId' | 'userId'>[]} tenantUsers - A list with TenantUser entities to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (tenantUsers: Pick<TenantUser, 'tenantId' | 'userId'>[] = []): Promise<void> => {
    if (!tenantUsers || tenantUsers.length === 0) {
      return;
    }

    Promise.all(
      tenantUsers.map(async (entity) => {
        return await this.tenantUserRepository.query(
          `DELETE FROM "TenantUser" WHERE "tenantId"='${entity.tenantId}' AND "userId"='${entity.userId}';`,
        );
      }),
    );
  };
}
