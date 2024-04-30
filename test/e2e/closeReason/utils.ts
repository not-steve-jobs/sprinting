import {CloseReason} from 'src/modules/closeReason/closeReason.entity';

export const getCloseReasonPrimaryKeys = (entity: Partial<CloseReason>): Pick<CloseReason, 'id'> => {
  return {
    id: entity.id,
  };
};

export const getTestCloseReasonsPrimaryKeys = (entities: Partial<CloseReason>[]): Pick<CloseReason, 'id'>[] => {
  return entities.map(getCloseReasonPrimaryKeys);
};
