import {INestApplication} from '@nestjs/common';
import {Test, TestingModule, TestingModuleBuilder} from '@nestjs/testing';
import * as dateFns from 'date-fns';
import {isArray} from 'lodash';
import {getRepository, Repository} from 'typeorm';

import {AppModule} from 'src/app.module';
import {User} from 'src/modules/user/user.entity';
import {ErrorListInit} from 'src/core/error/errorListInit';
import {WarningListInit} from 'src/core/error/warningListInit';
import {addMockedMiddleware, addMockedProviderToModule, MockProviderOptions} from './mock.helpers';
import {testTenant} from '../tenant/data';

interface TestNestApplicationOptions {
  tenantId?: number;
  mockProviders?: MockProviderOptions[];
}

/**
 * Create a new test app which can be used to execute some e2e tests to the real API endpoints
 *
 * @param {MockProviderOptions[] | null} mockProviders - Optional parm with a list of mock provider options, they will be used to override the default app providers
 * @returns {Promise<INestApplication>} - A simple test bundle of the Nest application
 */
export const createTestNestApplication = async ({
  tenantId = testTenant.id,
  mockProviders = [],
}: TestNestApplicationOptions): Promise<INestApplication> => {
  ErrorListInit();
  WarningListInit();

  // Create test module builder and add mocked providers if any
  const moduleRefBuilder: TestingModuleBuilder = Test.createTestingModule({imports: [AppModule]});
  mockProviders.forEach((mockOption: MockProviderOptions) => addMockedProviderToModule(moduleRefBuilder, mockOption));

  // Create test module
  const moduleRef: TestingModule = await moduleRefBuilder.compile();

  // Create test app
  const app: INestApplication = moduleRef.createNestApplication();
  addMockedMiddleware(tenantId);

  await app.init();

  return app;
};

/**
 * Get a reference to the Cypress User which is used by the e2e tests
 *
 * @returns {Promise<User>} - A reference to the Test User
 */
export const getTestUser = async (): Promise<User> => {
  const userRepository: Repository<User> = getRepository(User);

  if (!process.env.E2E_TESTS_USER_EMAIL) {
    throw new Error('Please provide the E2E_TESTS_USER_EMAIL env variable which is required by this service.');
  }

  const user: User = await userRepository.findOne({
    email: process.env.E2E_TESTS_USER_EMAIL,
  });

  return user;
};

/**
 * Serialize the provided list to a string with comma separated string with values surrounded by quotes so it can be used in the SQL Queries
 * Example: ['a', 'b', 'c'] => "'a','b','c'"
 *
 * @param {string[]} array - A list with values which have to be merged into a single string
 * @returns {string} - A string with comma separated values surrounded with quotes
 */
export const serializeArrayAsSQLString = (array: string[]): string => {
  if (!array || array.length === 0) {
    return '';
  }

  return `'${array.join(`','`)}'`;
};

/**
 * Prepare a simple INSERT query statement
 * This should be used when we have primary columns which are auto increment and we need to save a record with specific id
 *
 * @param {string} tableName - The name of the table which should be used in the SQL statement
 * @param {Object} entity - The entity with all of the data we want to insert into the table
 * @returns - The prepared INSERT SQL query, ready to be provided to the entity manager
 */
export const createInsertQuery = (tableName, entity: Object | Object[]): string => {
  let columns: string = '';
  const values: string[] = [];
  if (isArray(entity)) {
    columns = `"${Object.keys(entity[0]).join(`","`)}"`;
    entity.forEach((item) => {
      values.push(createValuesForInsert(item));
    });
  } else {
    columns = `"${Object.keys(entity).join(`","`)}"`;
    values.push(createValuesForInsert(entity));
  }
  return `
    BEGIN;
      INSERT INTO "${tableName}" (${columns}) VALUES ${values.join(', ')};
    COMMIT;
  `;
};

/**
 * Prepare multiple values for INSERT query
 *
 * @param {Object} entity - The entity with all of the data we want to insert into the table
 * @returns - The prepared values for INSERT
 */
export const createValuesForInsert = (entity: Object): string => {
  const stringifiedValues: string[] = Object.values(entity).map((value) => {
    if (value instanceof Date) {
      return dateFns.format(value, 'yyyy/MM/dd HH:mm:ss');
    }
    if (value === null) {
      return '{}';
    }
    return value.toString();
  });

  const values: string = `'${stringifiedValues.join(`','`)}'`;
  return `(${values})`;
};

/**
 * Will generate a test date
 *
 * @returns {Date} - A test date (Jan 02 2020 03:04:05)
 */
export const getTestDate = () => dateFns.toDate(new Date(2020, 0, 2, 3, 4, 5));
