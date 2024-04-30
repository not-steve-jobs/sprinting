import {getManager, getRepository, Repository} from 'typeorm';

import {createInsertQuery} from '../utils/helpers';

import {DatabaseHelper} from '../utils/seed';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {testTenantUserLocation} from './data';

export class TenantUserLocationDatabaseHelper implements DatabaseHelper {
  private tenantUserLocationRepository: Repository<TenantUserLocation>;

  constructor() {
    this.tenantUserLocationRepository = getRepository(TenantUserLocation);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Tenant User Location records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await getManager().query(createInsertQuery('TenantUserLocation', testTenantUserLocation));
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {Pick<TenantUserLocation, 'tenantId' | 'userId' | 'locationId'>[]} tenantUserLocations - A list with TenantUserLocation entities to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (
    tenantUserLocations: Pick<TenantUserLocation, 'tenantId' | 'userId' | 'locationId'>[] = [],
  ): Promise<void> => {
    if (!tenantUserLocations || tenantUserLocations.length === 0) {
      return;
    }

    Promise.all(
      tenantUserLocations.map(async (entity) => {
        return await this.tenantUserLocationRepository.query(
          `DELETE FROM "TenantUserLocation" WHERE "tenantId"='${entity.tenantId}' AND "userId"='${entity.userId}' AND "locationId"='${entity.locationId}';`,
        );
      }),
    );
  };
}
