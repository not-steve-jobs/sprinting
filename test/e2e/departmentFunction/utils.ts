import {DepartmentFunction} from 'src/modules/departmentFunction/departmentFunction.entity';

export const getDepartmentFunctionPrimaryKeys = (
  entity: Partial<DepartmentFunction>,
): Pick<DepartmentFunction, 'id'> => {
  return {
    id: entity.id,
  };
};

export const getTestDepartmentFunctionsPrimaryKeys = (
  entities: Partial<DepartmentFunction>[],
): Pick<DepartmentFunction, 'id'>[] => {
  return entities.map(getDepartmentFunctionPrimaryKeys);
};
