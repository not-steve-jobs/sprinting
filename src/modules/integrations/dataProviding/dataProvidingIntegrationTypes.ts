import {PlainObject} from './../../common/common.dto';
export enum DataProvidingEvents {
  clientCreated = 'clientCreated',
  clientLocationCreated = 'clientLocationCreated',
  clientUpdated = 'clientUpdated',
  clientLocationUpdated = 'clientLocationUpdated',
  userCreated = 'userCreated',
  userUpdated = 'userUpdated',
  tenantUserCreated = 'tenantUserCreated',
  tenantUserUpdated = 'tenantUserUpdated',
  tenantUserLocationCreated = 'tenantUserLocationCreated',
  tenantUserLocationUpdated = 'tenantUserLocationUpdated',
  branchCreated = 'branchCreated',
  branchUpdated = 'branchUpdated',
}

export type DataProvidingEventObject = {
  body: PlainObject;
  applicationProperties: PlainObject;
};
