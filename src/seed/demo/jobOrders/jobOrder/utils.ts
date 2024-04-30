import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {Status} from 'src/modules/status/status.entity';
import {filterEntitiesByTenantId, getFeatureConfiguration, filterStatusesByEntityName} from 'src/seed/utils/helpers';
import {ServiceType} from 'src/modules/serviceType/serviceType.entity';
import {Shift} from 'src/modules/shift/shift.entity';
import {Rate} from 'src/modules/rate/rate.entity';
import {Type} from 'src/modules/type/type.entity';
import {JobRole} from 'src/modules/jobRole/jobRole.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {Location} from 'src/modules/location/location.entity';

import {filterLocationsByClient} from '../../locations';
import {LocationStatusEnum} from 'src/modules/location/location.enum';
import {AuthRoles} from 'src/core/auth/authRoles';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {getTenantUserLocationIds, getTenantUserLocationsByTenantIdAndUserId} from '../../users/user/utils';
import {OrderDetailsListingStatusesFeatureConfiguration} from 'src/seed/tenantSpecific/featureConfiguration/features/OrderDetailsListingStatuses/interface';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {FeatureConfigurationChannel} from 'src/modules/featureConfiguration/enum/featureConfigurationChannel.enum';
import {EmploymentType} from 'src/modules/employmentType/employmentType.entity';
import {Certification} from 'src/modules/certification/certification.entity';
import {WorkType} from 'src/modules/workType/workType.entity';
import {TypeEntityEnum} from 'src/modules/type/type.enum';
import {JobOrderStatus} from 'src/modules/status/status.enum';
import {adeccoUsa} from 'src/seed/tenantSpecific/data/tenant.data';

export const filterJobOrdersByTenant = (jobOrders: JobOrder[], tenantId: number): JobOrder[] => {
  return filterEntitiesByTenantId<JobOrder>(jobOrders, tenantId);
};

export const filterJobOrderStatuses = (statuses: Status[], tenantId: number): Status[] => {
  let allowedStatuses: string[] = [
    JobOrderStatus.Submitted,
    JobOrderStatus.InProgress,
    JobOrderStatus.CandidatesPreselection,
    JobOrderStatus.PartiallyCovered,
    JobOrderStatus.Covered,
    JobOrderStatus.Draft,
  ];

  if (tenantId === adeccoUsa.id) {
    allowedStatuses = allowedStatuses.concat([JobOrderStatus.CanceledByTheClient, JobOrderStatus.CancelledByAdecco]);
  }

  const jobOrderStatuses: Status[] = filterStatusesByEntityName(statuses, tenantId, JobOrder.name);

  return jobOrderStatuses.filter((status) => {
    return allowedStatuses.includes(status.name);
  });
};

export const findJobOrderStatusByName = (statuses: Status[], tenantId: number, statusName: string): Status => {
  const jobOrderAssociateStatuses: Status[] = filterJobOrderStatuses(statuses, tenantId);
  return jobOrderAssociateStatuses.find((status) => status.name === statusName);
};

export const filterServiceTypesByTenant = (serviceTypes: ServiceType[], tenantId: number): ServiceType[] => {
  return filterEntitiesByTenantId<ServiceType>(serviceTypes, tenantId);
};

export const filterShiftsByTenant = (shifts: Shift[], tenantId: number): Shift[] => {
  return filterEntitiesByTenantId<Shift>(shifts, tenantId);
};

export const filterRatesByTenant = (rates: Rate[], tenantId: number): Rate[] => {
  return filterEntitiesByTenantId<Rate>(rates, tenantId);
};

export const filterContractTypesByTenant = (contractTypes: Type[], tenantId: number): Type[] => {
  const tenantTypes: Type[] = filterEntitiesByTenantId<Type>(contractTypes, tenantId);

  return tenantTypes.filter((type) => {
    return type.entityName === TypeEntityEnum.Contract;
  });
};

export const filterJobRolesByTenant = (jobRoles: JobRole[], tenantId: number): JobRole[] => {
  return filterEntitiesByTenantId<JobRole>(jobRoles, tenantId);
};

export const filterEmploymentTypesByTenant = (
  employmentTypes: EmploymentType[],
  tenantId: number,
): EmploymentType[] => {
  return filterEntitiesByTenantId<EmploymentType>(employmentTypes, tenantId);
};

export const filterCertificationsByTenant = (certifications: Certification[], tenantId: number): Certification[] => {
  return filterEntitiesByTenantId<Certification>(certifications, tenantId);
};

export const filterWorkTypesByTenant = (workTypes: WorkType[], tenantId: number): WorkType[] => {
  return filterEntitiesByTenantId<WorkType>(workTypes, tenantId);
};

export const filterTenantUsersByTenantAndClient = (
  tenantUsers: TenantUser[],
  tenantId: number,
  clientId: string,
): TenantUser[] => {
  return tenantUsers.filter((tenantUser) => {
    return tenantUser.tenantId === tenantId && tenantUser.user.clientId === clientId;
  });
};

/**
 * Get valid locations for selected user
 * client-staff have only access to some of client locations
 * client-admin have access to all client locations
 *
 * @param {TenantUser} tenantUser - The User for which we want to filter out the Locations
 * @param {string} clientId - The ID of the Client for which we want to filter out the Locations
 * @param {Location[]} locations - List with all available locations which we want to filter out
 * @param {TenantUserLocation[]} tenantUserLocations - List with all TenantUserLocations which are associated with the
 *                                                     TenantUsers and have to be used in order to determine which Locations
 *                                                    are associated with the required TenantUser
 * @returns {Location[]}
 */
export const filterLocationsByClientAndUser = (
  clientId: string,
  tenantUser: TenantUser,
  locations: Location[],
  tenantUserLocations: TenantUserLocation[],
): Location[] => {
  const allowedLocationStatuses: LocationStatusEnum[] = [
    LocationStatusEnum.Active,
    LocationStatusEnum.UnderReview,
    LocationStatusEnum.Disabled,
  ];
  let clientLocations: Location[] = filterLocationsByClient(locations, clientId, allowedLocationStatuses); // Admin locations

  if (!AuthRoles.isAdmin(tenantUser.roleId)) {
    // Narrow down locations list because the current user isn't admin and probably have only a few locations
    const filteredTenantUserLocations: TenantUserLocation[] = getTenantUserLocationsByTenantIdAndUserId(
      tenantUserLocations,
      tenantUser.tenantId,
      tenantUser.userId,
    );
    const tenantUserLocationIds: string[] = getTenantUserLocationIds(filteredTenantUserLocations);

    clientLocations = clientLocations.filter(({id: locationId}) => tenantUserLocationIds.includes(locationId));
  }

  return clientLocations;
};

// TODO: Fix type once the FeatureConfiguration is well documented
export const getOrderDetailsListingStatusesFeatureConfiguration = (
  tenantFeatureConfiguration: any,
): OrderDetailsListingStatusesFeatureConfiguration => {
  const featureConfiguration = getFeatureConfiguration(
    tenantFeatureConfiguration,
    FeatureConfigurationFeature.OrderDetailsListingStatuses,
    FeatureConfigurationChannel.CLA,
  );

  return featureConfiguration?.config;
};

// Note: At some point this can be moved in the Statuses seed
export const findStatusById = (statuses: Status[], statusId: number): Status => {
  return statuses.find((status) => status.id === statusId);
};

export const filterJobOrdersByStatus = (jobOrders: JobOrder[], statuses: Status[]): JobOrder[] => {
  const statusIds: number[] = statuses.map((status) => status.id);

  return jobOrders.filter((jobOrder) => {
    return statusIds.includes(jobOrder.statusId);
  });
};
