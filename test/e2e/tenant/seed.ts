import {getManager, getRepository, Repository} from 'typeorm';

import {Tenant} from 'src/modules/tenant/tenant.entity';

import {createInsertQuery, serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';
import {testTenant} from './data';

export class TenantDatabaseHelper implements DatabaseHelper {
  private tenantRepository: Repository<Tenant>;

  constructor() {
    this.tenantRepository = getRepository(Tenant);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Tenant records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await getManager().query(
      createInsertQuery('Tenant', {...testTenant, appConfig: JSON.stringify(testTenant.appConfig)}),
    );
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} tenantIDs - A list with Case IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (tenantIDs: string[] = []): Promise<void> => {
    if (!tenantIDs || tenantIDs.length === 0) {
      return;
    }

    const serializedTenantIds: string = serializeArrayAsSQLString(tenantIDs);

    await this.tenantRepository.query(`DELETE FROM "Tenant" WHERE "id" IN (${serializedTenantIds});`);
  };
}
