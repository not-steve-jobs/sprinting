import {getManager, getRepository, Repository} from 'typeorm';

import {createInsertQuery, serializeArrayAsSQLString} from '../utils/helpers';

import {DatabaseHelper} from '../utils/seed';
import {Department} from 'src/modules/department/department.entity';
import {testChangedDepartment, testDepartment} from './data';

export class DepartmentDatabaseHelper implements DatabaseHelper {
  private departmentRepository: Repository<Department>;

  constructor() {
    this.departmentRepository = getRepository(Department);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Department records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await getManager().query(createInsertQuery('Department', testDepartment));
    await getManager().query(createInsertQuery('Department', testChangedDepartment));
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} departmentIds - A list with Case IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (departmentIds: string[] = []): Promise<void> => {
    if (!departmentIds || departmentIds.length === 0) {
      return;
    }

    const serializedDepartmentIds: string = serializeArrayAsSQLString(departmentIds);

    await this.departmentRepository.query(`DELETE FROM "Department" WHERE "id" IN (${serializedDepartmentIds});`);
  };
}
