export interface DataDestinationSystem {
  eventsEnabled: boolean;
  systemName: string;
  eventsTopic: string;
  connectionString: string;
  eventsConfiguration: DataProvidingEventsConfiguration;
}

export interface DataProvidingEventsConfiguration {
  clientCreated: boolean;
  clientLocationCreated: boolean;
  clientUpdated: boolean;
  clientLocationUpdated: boolean;
  userCreated: boolean;
  userUpdated: boolean;
  tenantUserCreated: boolean;
  tenantUserUpdated: boolean;
  tenantUserLocationCreated: boolean;
  tenantUserLocationUpdated: boolean;
  branchCreated: boolean;
  branchUpdated: boolean;
}
