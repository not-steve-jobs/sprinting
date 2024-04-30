import {getManager, getRepository, Repository} from 'typeorm';

import {DepartmentFunction} from 'src/modules/departmentFunction/departmentFunction.entity';

import {createInsertQuery, serializeArrayAsSQLString} from '../utils/helpers';
import {DatabaseHelper} from '../utils/seed';
import {testChangedDepartmentFunction, testDepartmentFunction} from './data';

export class DepartmentFunctionDatabaseHelper implements DatabaseHelper {
  private departmentFunctionRepository: Repository<DepartmentFunction>;

  constructor() {
    this.departmentFunctionRepository = getRepository(DepartmentFunction);
  }

  /**
   * Prepare the database for the e2e tests by seeding a specific Department Function records
   *
   * @returns {Promise<void>} - A simple promise to ensure that all af the actions has been processed
   */
  public seed = async (): Promise<void> => {
    await getManager().query(createInsertQuery('DepartmentFunction', testDepartmentFunction));
    await getManager().query(createInsertQuery('DepartmentFunction', testChangedDepartmentFunction));
  };

  /**
   * Cleanup the database after the execution of all tests by deleting all new test records
   *
   * @param {number[]} departmentFunctionIds - A list with Case IDs to pass for deletion
   * @returns {Promise<void>} - A simple promise to ensure that the cleanup finished
   */
  public cleanup = async (departmentFunctionIds: string[] = []): Promise<void> => {
    if (!departmentFunctionIds || departmentFunctionIds.length === 0) {
      return;
    }

    const serializedDepartmentFunctionIds: string = serializeArrayAsSQLString(departmentFunctionIds);

    await this.departmentFunctionRepository.query(
      `DELETE FROM "DepartmentFunction" WHERE "id" IN (${serializedDepartmentFunctionIds});`,
    );
  };
}
