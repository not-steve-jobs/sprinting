import {Status} from 'src/modules/status/status.entity';

export const getStatusPrimaryKeys = (entity: Partial<Status>): Pick<Status, 'id'> => {
  return {
    id: entity.id,
  };
};

export const getTestStatusesPrimaryKeys = (entities: Partial<Status>[]): Pick<Status, 'id'>[] => {
  return entities.map(getStatusPrimaryKeys);
};
