import {getManager, getRepository, Repository} from 'typeorm';

import {createInsertQuery} from '../utils/helpers';

import {DatabaseHelper} from '../utils/seed';
import {TenantUserPermission} from 'src/modules/tenantUserPermission/tenantUserPermission.entity';
import {testChangedTenantUserPermission, testTenantUserPermission} from './data';

export class TenantUserPermissionDatabaseHelper implements DatabaseHelper {
  private tenantUserPermissionRepository: Repository<TenantUserPermission>;

  constructor() {
    this.tenantUserPermissionRepository = getRepository(TenantUserPermission);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Tenant User Permission records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await getManager().query(createInsertQuery('TenantUserPermission', testTenantUserPermission));
    await getManager().query(createInsertQuery('TenantUserPermission', testChangedTenantUserPermission));
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {Pick<TenantUserPermission, 'tenantId' | 'userId' | 'locationId'>[]} tenantUserPermissions - A list with TenantUserPermission entities to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (
    tenantUserPermissions: Pick<TenantUserPermission, 'tenantId' | 'userId' | 'permissionId'>[] = [],
  ): Promise<void> => {
    if (!tenantUserPermissions || tenantUserPermissions.length === 0) {
      return;
    }

    Promise.all(
      tenantUserPermissions.map(async (entity) => {
        return await this.tenantUserPermissionRepository.query(
          `DELETE FROM "TenantUserPermission" WHERE "tenantId"='${entity.tenantId}' AND "userId"='${entity.userId}' AND "permissionId"='${entity.permissionId}';`,
        );
      }),
    );
  };
}
