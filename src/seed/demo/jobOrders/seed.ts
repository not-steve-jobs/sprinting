import {Connection} from 'typeorm/connection/Connection';

import {Client} from 'src/modules/client/client.entity';
import {LocationBranch} from 'src/modules/locationBranch/locationBranch.entity';
import {Status} from 'src/modules/status/status.entity';
import {Location} from 'src/modules/location/location.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {JobOrderAssociate} from 'src/modules/jobOrderAssociate/jobOrderAssociate.entity';

import {log} from 'src/seed/utils/seed.utils';
import {seedJobOrdersData} from './jobOrder';
import {seedJobOrdersAssociates} from './jobOrderAssociate/seed';
import {Shift} from 'src/modules/shift/shift.entity';
import {Rate} from 'src/modules/rate/rate.entity';
import {Type} from 'src/modules/type/type.entity';
import {JobRole} from 'src/modules/jobRole/jobRole.entity';
import {EmploymentType} from 'src/modules/employmentType/employmentType.entity';
import {Language} from 'src/modules/language/language.entity';
import {Certification} from 'src/modules/certification/certification.entity';
import {Level} from 'src/modules/level/level.entity';
import {JobOrderLanguage} from 'src/modules/jobOrderLanguage/jobOrderLanguage.entity';
import {JobOrderCertification} from 'src/modules/jobOrderCertification/jobOrderCertification.entity';
import {WorkType} from 'src/modules/workType/workType.entity';
import {TenantUserPermissionService} from 'src/modules/tenantUserPermission/tenantUserPermission.service';
import {CloseReason} from 'src/modules/closeReason/closeReason.entity';
import {CloseReasonArguments} from 'src/modules/closeReasonArguments/closeReasonArguments.entity';

import {seedJobOrdersLanguages} from './jobOrderLanguage';
import {seedJobOrdersCertifications} from './jobOrderCertification';
import {seedCancelledJobOrdersDetails} from './closeReasonArguments/seed';
import {ServiceType} from 'src/modules/serviceType/serviceType.entity';

export interface SeedJobOrderResources {
  statuses: Status[];
  locationBranches: LocationBranch[];
  clients: Client[];
  tenantUsers: TenantUser[];
  locations: Location[];
  tenantUserLocations: TenantUserLocation[];
  shifts: Shift[];
  rates: Rate[];
  types: Type[];
  jobRoles: JobRole[];
  employmentTypes: EmploymentType[];
  languages: Language[];
  levels: Level[];
  certifications: Certification[];
  workTypes: WorkType[];
  closeReasons: CloseReason[];
  serviceTypes: ServiceType[];

  tenantUserPermissionService: TenantUserPermissionService;
}

export interface SeedJobOrderResponse {
  createdJobOrders: JobOrder[];
  createdJobOrderLanguages: JobOrderLanguage[];
  createdJobOrderCertifications: JobOrderCertification[];
  createdJobOrderAssociates: JobOrderAssociate[];
  createdCloseReasonArguments: CloseReasonArguments[];
}

/**
 * Seed demo data for the Job Orders in the system
 * Note: Maybe it will be better if we move the logic related with the reference tables in the method
 * for creating a specific JobOrder. So it will be clear that when we want to seed a JobOrder it will seed everything we need for it
 *
 * @param {Connection} db - The active connection with the database
 * @param {SeedJobOrderResources} resources - List with all of the resources used to seed the JobOrders and reference with them
 * @returns {Promise<SeedClientResponse>} - A list with all of the seeded JobOrders and details for them
 */
export const seedJobOrders = async (
  db: Connection,
  resources: SeedJobOrderResources,
): Promise<SeedJobOrderResponse> => {
  log('Seeding Job Orders');

  const createdJobOrders: JobOrder[] = await seedJobOrdersData(db, resources);
  const createdJobOrderLanguages: JobOrderLanguage[] = await seedJobOrdersLanguages(
    db,
    createdJobOrders,
    resources.languages,
    resources.levels,
  );
  const createdJobOrderCertifications: JobOrderCertification[] = await seedJobOrdersCertifications(
    db,
    createdJobOrders,
    resources.certifications,
  );
  const createdJobOrderAssociates: JobOrderAssociate[] = await seedJobOrdersAssociates(
    db,
    createdJobOrders,
    resources.statuses,
  );
  const createdCloseReasonArguments: CloseReasonArguments[] = await seedCancelledJobOrdersDetails(
    db,
    createdJobOrders,
    resources.statuses,
    resources.closeReasons,
  );

  return {
    createdJobOrders,
    createdJobOrderLanguages,
    createdJobOrderCertifications,
    createdJobOrderAssociates,
    createdCloseReasonArguments,
  };
};
