import {DepartmentFunction} from 'src/modules/departmentFunction/departmentFunction.entity';
import {testChangedDepartment, testDepartment} from '../department/data';
import {getTestDate} from '../utils/helpers';

export const testDepartmentFunction: Omit<DepartmentFunction, 'department'> = {
  id: '12345678-0000-4002-0000-000000000001',
  departmentId: testDepartment.id,
  name: 'HR Manager',
  keyName: '',
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testChangedDepartmentFunction: Omit<DepartmentFunction, 'department'> = {
  id: '12345678-0000-4002-0000-000000000002',
  departmentId: testChangedDepartment.id,
  name: 'HR Manager',
  keyName: 'string',
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testDepartmentFunctions: Omit<DepartmentFunction, 'department'>[] = [
  testDepartmentFunction,
  testChangedDepartmentFunction,
];
