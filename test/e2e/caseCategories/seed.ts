import {getRepository, Repository} from 'typeorm';

import {CaseCategory} from 'src/modules/caseCategory/caseCategory.entity';

import {serializeArrayAsSQLString} from '../utils/helpers';
import {testCaseCategory} from './data';
import {DatabaseHelper} from '../utils/seed';

export class CaseCategoryDatabaseHelper implements DatabaseHelper {
  private caseCategoryRepository: Repository<CaseCategory>;

  constructor() {
    this.caseCategoryRepository = getRepository(CaseCategory);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Case Categories records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await this.caseCategoryRepository.save(testCaseCategory);
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} caseCategoryIds - A list with Case IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (caseCategoryIds: string[] = []): Promise<void> => {
    if (!caseCategoryIds || caseCategoryIds.length === 0) {
      return;
    }

    const serializedCaseCategoryIds: string = serializeArrayAsSQLString(caseCategoryIds);

    await this.caseCategoryRepository.query(`DELETE FROM "CaseCategory" WHERE "id" IN (${serializedCaseCategoryIds});`);
  };
}
