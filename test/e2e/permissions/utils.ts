import {Permission} from 'src/modules/permission/permission.entity';

export const getPermissionPrimaryKeys = (entity: Partial<Permission>): Pick<Permission, 'id'> => {
  return {
    id: entity.id,
  };
};

export const getTestPermissionsPrimaryKeys = (entities: Partial<Permission>[]): Pick<Permission, 'id'>[] => {
  return entities.map(getPermissionPrimaryKeys);
};
