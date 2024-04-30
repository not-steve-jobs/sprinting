import {Role} from 'src/modules/role/role.entity';

export const getRolePrimaryKeys = (entity: Partial<Role>): Pick<Role, 'id'> => {
  return {
    id: entity.id,
  };
};

export const getTestRolesPrimaryKeys = (entities: Partial<Role>[]): Pick<Role, 'id'>[] => {
  return entities.map(getRolePrimaryKeys);
};
