import {Client} from 'src/modules/client/client.entity';

export const getClientPrimaryKeys = (entity: Partial<Client>): Pick<Client, 'id'> => {
  return {
    id: entity.id,
  };
};

export const getTestClientsPrimaryKeys = (entities: Partial<Client>[]): Pick<Client, 'id'>[] => {
  return entities.map(getClientPrimaryKeys);
};
