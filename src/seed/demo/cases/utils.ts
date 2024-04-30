import {Case} from 'src/modules/case/case.entity';
import {Contract} from 'src/modules/contract/contract.entity';
import {Status} from 'src/modules/status/status.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {CaseEntityNameEnum} from 'src/modules/case/case.enum';
import {Invoice} from 'src/modules/invoice/invoice.entity';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';

import {DEMO_ENTITY_NAMES} from './data';
import {filterEntitiesByTenantId, getRandomItem} from 'src/seed/utils/helpers';

export const filterCasesByTenant = (cases: Case[], tenantId: number): Case[] => {
  return filterEntitiesByTenantId<Case>(cases, tenantId);
};

export const filterContractsByTenant = (contracts: Contract[], tenantId: number): Contract[] => {
  return filterEntitiesByTenantId<Contract>(contracts, tenantId);
};

export const filterCaseStatusesByTenant = (statuses: Status[], tenantId: number): Status[] => {
  return statuses.filter((status: Status) => {
    return status.entityName === Case.name && status.tenantId === tenantId;
  });
};

export const filterTenantUsersByTenant = (tenantUsers: TenantUser[], tenantId: number): TenantUser[] => {
  return filterEntitiesByTenantId<TenantUser>(tenantUsers, tenantId);
};

export interface CaseEntity {
  entity: Contract | Invoice | JobOrder;
  entityName: CaseEntityNameEnum;
}

export const getRandomCaseEntity = (contracts: Contract[], invoices: Invoice[], jobOrders: JobOrder[]): CaseEntity => {
  let entity: Contract | Invoice | JobOrder;
  let entityName: CaseEntityNameEnum = getRandomItem(DEMO_ENTITY_NAMES);

  switch (entityName) {
    case CaseEntityNameEnum.Contracts:
      entity = getRandomItem(contracts);
      break;
    case CaseEntityNameEnum.Invoices:
      entity = getRandomItem(invoices);
      break;
    case CaseEntityNameEnum.StaffingRequests:
      entity = getRandomItem(jobOrders);
      break;
    case CaseEntityNameEnum.None:
    default:
      entity = null;
      break;
  }

  if (!entity) {
    entityName = CaseEntityNameEnum.None;
  }

  return {
    entity,
    entityName,
  };
};
