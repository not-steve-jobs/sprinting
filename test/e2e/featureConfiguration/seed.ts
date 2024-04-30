import {getRepository, Repository} from 'typeorm';

import {serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';

import {FeatureConfiguration} from 'src/modules/featureConfiguration/featureConfiguration.entity';
import {testFeatureConfiguration, testFeatureConfigurationDisabled} from './data';

export class FeatureConfigurationDatabaseHelper implements DatabaseHelper {
  private featureConfigurationRepository: Repository<FeatureConfiguration>;

  constructor() {
    this.featureConfigurationRepository = getRepository(FeatureConfiguration);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Status records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await this.featureConfigurationRepository.save(testFeatureConfiguration);
    await this.featureConfigurationRepository.save(testFeatureConfigurationDisabled);
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} featureConfigurationIds - A list with Status IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (featureConfigurationIds: string[] = []): Promise<void> => {
    if (!featureConfigurationIds || featureConfigurationIds.length === 0) {
      return;
    }

    const serializedFeatureConfigurationIds: string = serializeArrayAsSQLString(featureConfigurationIds);

    await this.featureConfigurationRepository.query(
      `DELETE FROM "FeatureConfiguration" WHERE "id" IN (${serializedFeatureConfigurationIds});`,
    );
  };
}
