import {Location} from 'src/modules/location/location.entity';
import {LocationStatusEnum} from 'src/modules/location/location.enum';
import {LocationBranch} from 'src/modules/locationBranch/locationBranch.entity';
import {getRandomIntIndex} from 'src/seed/utils/seed.utils';

export const filterLocationsByClient = (
  locations: Location[],
  clientId: string,
  locationStatus?: LocationStatusEnum[],
): Location[] => {
  if (locationStatus) {
    locations = locations.filter((location: Location) => locationStatus.includes(location.status));
  }

  return locations.filter((location: Location) => location.clientId === clientId);
};

export const getRandomLocationByClient = (locations: Location[], clientId: string): Location => {
  const clientLocations: Location[] = filterLocationsByClient(locations, clientId);
  const location: Location = clientLocations[getRandomIntIndex(clientLocations.length)];

  return location;
};

export const getLocationBranchByLocation = (
  locationBranches: LocationBranch[],
  tenantId: number,
  locationId: string,
): LocationBranch => {
  return locationBranches.find((locationBranch) => {
    // Not sure what is the purpose of the inTerritory rule in the query
    return (
      locationBranch.tenantId === tenantId && locationBranch.locationId === locationId && locationBranch.inTerritory
    );
  });
};

export const getLocationBranchesByLocation = (
  locationBranches: LocationBranch[],
  tenantId: number,
  locationId: string,
): LocationBranch[] => {
  return locationBranches.filter((locationBranch) => {
    // Not sure what is the purpose of the inTerritory rule in the query
    return (
      locationBranch.tenantId === tenantId && locationBranch.locationId === locationId && locationBranch.inTerritory
    );
  });
};
