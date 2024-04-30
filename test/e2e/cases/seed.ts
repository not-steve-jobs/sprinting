import {getRepository, Repository} from 'typeorm';

import {Case} from 'src/modules/case/case.entity';
import {CaseFollower} from 'src/modules/caseFollower/caseFollower.entity';

import {serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';
import {testCase} from './data';

export class CaseDatabaseHelper implements DatabaseHelper {
  private caseRepository: Repository<Case>;
  private caseFollowerRepository: Repository<CaseFollower>;

  constructor() {
    this.caseRepository = getRepository(Case);
    this.caseFollowerRepository = getRepository(CaseFollower);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Case records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await this.caseRepository.save(testCase);
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} caseIds - A list with Case IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (caseIds: string[] = []): Promise<void> => {
    if (!caseIds || caseIds.length === 0) {
      return;
    }

    const serializedCaseIds: string = serializeArrayAsSQLString(caseIds);

    await this.caseFollowerRepository.query(`DELETE FROM "CaseFollower" WHERE "caseId" IN (${serializedCaseIds});`);
    await this.caseRepository.query(`DELETE FROM "Case" WHERE "id" IN (${serializedCaseIds});`);
  };

  /**
   * Get a the seeded test Case record which can have created for the e2e tests
   *
   * @param {number} tenantId - The Tenant ID which should be used by the filter rule
   * @returns {Promise<Case>} - A Case record
   */
  public getTestCase = async (tenantId: number): Promise<Case> => {
    const seedTestCase: Case = await this.caseRepository.findOne({
      id: testCase.id,
      tenantId,
    });

    return seedTestCase;
  };
}
