import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';

export const getTenantUserLocationPrimaryKeys = (
  entity: Partial<TenantUserLocation>,
): Pick<TenantUserLocation, 'tenantId' | 'userId' | 'locationId'> => {
  return {
    tenantId: entity.tenantId,
    userId: entity.userId,
    locationId: entity.locationId,
  };
};
