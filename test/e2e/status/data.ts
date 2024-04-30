import {Status} from 'src/modules/status/status.entity';
import {getTestDate} from '../utils/helpers';
import {testTenant} from '../tenant/data';
import {UserStatus} from 'src/modules/status/status.enum';
import {User} from 'src/modules/user/user.entity';

export const testCaseStatus: Omit<Status, 'tenant'> = {
  id: 123456789,
  tenantId: testTenant.id,
  entityName: 'Case',
  name: 'open',
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testCaseUpdateStatus: Omit<Status, 'tenant'> = {
  id: 234567890,
  tenantId: testTenant.id,
  entityName: 'Case',
  name: 'open',
  createdAt: new Date('2020-01-02 03:04:05'),
  updatedAt: new Date('2020-01-02 03:04:05'),
};

export const testUserActiveStatus: Omit<Status, 'tenant'> = {
  id: 444400005,
  tenantId: testTenant.id,
  entityName: User.name,
  name: UserStatus.Active,
  createdAt: getTestDate(),
  updatedAt: getTestDate(),
};

export const testStatusesData: Omit<Status, 'tenant'>[] = [
  testUserActiveStatus,
  {
    id: 444400001,
    name: UserStatus.Invited,
    entityName: User.name,
    tenantId: testTenant.id,
    createdAt: getTestDate(),
    updatedAt: getTestDate(),
  },
  {
    id: 444400002,
    name: UserStatus.NotInvited,
    entityName: User.name,
    tenantId: testTenant.id,
    createdAt: getTestDate(),
    updatedAt: getTestDate(),
  },
  {
    id: 444400003,
    name: UserStatus.Disabled,
    entityName: User.name,
    tenantId: testTenant.id,
    createdAt: getTestDate(),
    updatedAt: getTestDate(),
  },
  {
    id: 444400004,
    name: UserStatus.InvitationExpired,
    entityName: User.name,
    tenantId: testTenant.id,
    createdAt: getTestDate(),
    updatedAt: getTestDate(),
  },
  testCaseStatus,
  testCaseUpdateStatus,
];
