import {CloseReason} from 'src/modules/closeReason/closeReason.entity';
import {CloseReasonEnum, CloseReasonTypeEnum} from 'src/modules/closeReason/closeReason.enum';
import {testTenant} from '../tenant/data';
import {getTestDate} from '../utils/helpers';

export const testTenantId: number = testTenant.id;

export const testCloseReasons: Omit<CloseReason, 'tenant'>[] = [
  /*
  test data to be added when we stop using demo seed for test DB
  {
    id: 995,
    tenantId: testTenantId,
    reason: CloseReasonEnum.Filled,
    type: CloseReasonTypeEnum.Internal,
    createdAt: getTestDate(),
    updatedAt: getTestDate(),
  },
  {
    id: 996,
    tenantId: testTenantId,
    reason: CloseReasonEnum.Other,
    type: CloseReasonTypeEnum.Internal,
    createdAt: getTestDate(),
    updatedAt: getTestDate(),
  },*/
  {
    id: 997,
    tenantId: testTenantId,
    reason: CloseReasonEnum.ChangedPlans,
    type: CloseReasonTypeEnum.Common,
    createdAt: getTestDate(),
    updatedAt: getTestDate(),
  },
  {
    id: 998,
    tenantId: testTenantId,
    reason: CloseReasonEnum.UnavailableEmployee,
    type: CloseReasonTypeEnum.Common,
    createdAt: getTestDate(),
    updatedAt: getTestDate(),
  },
  {
    id: 999,
    tenantId: testTenantId,
    reason: CloseReasonEnum.CreditProblems,
    type: CloseReasonTypeEnum.External,
    createdAt: getTestDate(),
    updatedAt: getTestDate(),
  },
];
