import {CaseCategory} from 'src/modules/caseCategory/caseCategory.entity';
import {getTestDate} from '../utils/helpers';

export const testCaseCategory: CaseCategory = {
  id: 123456789,
  name: 'Test Case Category',
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};
