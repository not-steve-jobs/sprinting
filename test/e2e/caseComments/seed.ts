import {getRepository, Repository} from 'typeorm';

import {CaseComment} from 'src/modules/caseComment/caseComment.entity';

import {serializeArrayAsSQLString} from '../utils/helpers';
import {testCaseComment} from './data';
import {DatabaseHelper} from '../utils/seed';

export class CaseCommentDatabaseHelper implements DatabaseHelper {
  private caseCommentRepository: Repository<CaseComment>;

  constructor() {
    this.caseCommentRepository = getRepository(CaseComment);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Case Comments records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await this.caseCommentRepository.save(testCaseComment);
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} caseCommentIds - A list with Case IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (caseCommentIds: string[] = []): Promise<void> => {
    if (!caseCommentIds || caseCommentIds.length === 0) {
      return;
    }

    const serializedCaseCommentIds: string = serializeArrayAsSQLString(caseCommentIds);

    await this.caseCommentRepository.query(`DELETE FROM "CaseComment" WHERE "id" IN (${serializedCaseCommentIds});`);
  };
}
