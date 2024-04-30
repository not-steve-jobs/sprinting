import {Injectable} from '@nestjs/common';
import {TenantUserLocationRepository} from './tenantUserLocation.repository';
import {TenantUserLocationError} from './tenantUserLocation.error';

@Injectable()
export class TenantUserLocationService {
  constructor(private readonly userLocationRepository: TenantUserLocationRepository) {}

  async getUserLocations(tenantId: number, userId: string): Promise<string[]> {
    try {
      const userLocations = await this.userLocationRepository.getUserLocations(tenantId, userId);
      return userLocations.map(({locationId}) => locationId);
    } catch (error) {
      throw new TenantUserLocationError.UserLocationUserLocationsError(null, error);
    }
  }

  async getUserExternalLocationIds(tenantId: number, userId: string): Promise<string[]> {
    try {
      return await this.userLocationRepository.getUserExternalLocationIds(tenantId, userId);
    } catch (error) {
      throw new TenantUserLocationError.UserLocationUserLocationsError(null, error);
    }
  }
}
