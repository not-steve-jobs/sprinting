import {UserProfile} from 'src/modules/userProfile/userProfile.entity';
import {testUser} from '../users/data';
import {DEMO_TITLES} from 'src/seed/demo/users';
import {testLocation} from '../locations/data';
import {testDepartment} from '../department/data';
import {testDepartmentFunction} from '../departmentFunction/data';
import {getTestDate} from '../utils/helpers';

export const testUserProfile: Partial<UserProfile> = {
  id: testUser.id,
  mainLocationId: testLocation.id,
  firstName: 'Cypress',
  lastName: 'Cypressic',
  phone: '5629937889',
  phonePrefix: '352',
  otherPhone: '1446347812',
  otherPhonePrefix: '355',
  language: 'en_US',
  worksite: 'Worksite5',
  dataAccess: true,
  departmentId: testDepartment.id,
  departmentFunctionId: testDepartmentFunction.id,
  title: DEMO_TITLES[0],
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const updateUserProfileRequest: Partial<UserProfile> = {
  firstName: 'John',
  lastName: 'John',
  phonePrefix: '357',
  phone: '7263377008',
  otherPhonePrefix: '237',
  otherPhone: '7263377009',
  language: 'English',
  worksite: 'Worksite3',
  mainLocationId: testLocation.id,
  title: 'Manager',
  department: {
    ...testDepartment,
    functions: [],
  },
  departmentFunction: {
    ...testDepartmentFunction,
    department: {
      ...testDepartment,
      functions: [],
    },
  },
  caseCounter: 1,
};
