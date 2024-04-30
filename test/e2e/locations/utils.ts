import {Location} from 'src/modules/location/location.entity';

export const getLocationPrimaryKeys = (entity: Partial<Location>): Pick<Location, 'id'> => {
  return {
    id: entity.id,
  };
};

export const getTestLocationsPrimaryKeys = (entities: Partial<Location>[]): Pick<Location, 'id'>[] => {
  return entities.map(getLocationPrimaryKeys);
};
