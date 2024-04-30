import {Department} from 'src/modules/department/department.entity';

export const getDepartmentPrimaryKeys = (entity: Partial<Department>): Pick<Department, 'id'> => {
  return {
    id: entity.id,
  };
};

export const getTestDepartmentsPrimaryKeys = (entities: Partial<Department>[]): Pick<Department, 'id'>[] => {
  return entities.map(getDepartmentPrimaryKeys);
};
