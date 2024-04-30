import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';

export const getTenantUserPrimaryKeys = (entity: Partial<TenantUser>): Pick<TenantUser, 'tenantId' | 'userId'> => {
  return {
    tenantId: entity.tenantId,
    userId: entity.userId,
  };
};

export const getTestTenantUsersPrimaryKeys = (
  entities: Partial<TenantUser>[],
): Pick<TenantUser, 'tenantId' | 'userId'>[] => {
  return entities.map(getTenantUserPrimaryKeys);
};
