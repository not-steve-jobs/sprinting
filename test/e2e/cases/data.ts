import {Case} from 'src/modules/case/case.entity';

import {testCaseCategory} from '../caseCategories/data';
import {testLocation} from '../locations/data';
import {testCaseStatus} from '../status/data';
import {testUser} from '../users/data';
import {getTestDate} from '../utils/helpers';
import {testTenant} from '../tenant/data';
import {CaseEntityNameEnum} from '../../../src/modules/case/case.enum';

export const testCase: Partial<Case> = {
  id: '12345678-0000-4000-0000-000000000001',
  tenantId: testTenant.id,
  userId: testUser.id,
  locationId: testLocation.id,
  statusId: testCaseStatus.id,
  caseCategoryId: testCaseCategory.id,
  entityName: CaseEntityNameEnum.Invoices,
  subject: 'Test Case',
  description: 'This is a test Case created for the e2e tests of the API.',
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testCommandCase: Partial<Case> = {
  id: '12345678-0000-4000-0000-000000000002',
  tenantId: testTenant.id,
  userId: testUser.id,
  locationId: testLocation.id,
  statusId: testCaseStatus.id,
  caseCategoryId: testCaseCategory.id,
  entityName: CaseEntityNameEnum.Invoices,
  subject: 'Test Case',
  description: 'This is a test Case created for the e2e tests of the createClientCase command.',
  createdAt: new Date('2020-01-02 03:04:05'),
  updatedAt: new Date('2020-01-02 03:04:05'),
};

export const testEventCase: Partial<Case> = {
  id: '12345678-0000-4000-0000-000000000003',
  tenantId: testTenant.id,
  userId: testUser.id,
  locationId: testLocation.id,
  statusId: testCaseStatus.id,
  caseCategoryId: testCaseCategory.id,
  entityName: CaseEntityNameEnum.Invoices,
  subject: 'Test Case',
  description: 'This is a test Case created for the e2e tests of the clientCaseUpdated event.',
  createdAt: new Date('2022-01-02 03:04:05'),
  updatedAt: new Date('2022-01-02 03:04:05'),
};
