import {CaseComment} from 'src/modules/caseComment/caseComment.entity';

import {testCase} from '../cases/data';
import {testUser} from '../users/data';
import {getTestDate} from '../utils/helpers';
import {testTenant} from '../tenant/data';

export const testCaseComment: Partial<CaseComment> = {
  id: '12345678-0000-4000-0000-000000000001',
  tenantId: testTenant.id,
  userId: testUser.id,
  caseId: testCase.id,
  value: 'testComment',
  isDraft: false,
  filesDeleted: false,
  userName: 'JestUser',
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};
