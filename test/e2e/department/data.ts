import {Department} from 'src/modules/department/department.entity';
import {getTestDate} from '../utils/helpers';

export const testDepartment: Omit<Department, 'functions'> = {
  id: '12345678-0000-4001-0000-000000000001',
  name: 'Quality Management',
  keyName: null,
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testChangedDepartment: Omit<Department, 'functions'> = {
  id: '12345678-0000-4001-0000-000000000002',
  name: 'Purchasing',
  keyName: null,
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testDepartments: Omit<Department, 'functions'>[] = [testDepartment, testChangedDepartment];
