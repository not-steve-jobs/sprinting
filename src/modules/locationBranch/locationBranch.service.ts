import {Injectable} from '@nestjs/common';
import {LocationBranchRepository} from './locationBranch.repository';
import {LocationBranchError} from './locationBranch.error';
import {LocationBranchDto} from './dto/locationBranch.dto';
import {CreateLocationBranchDto} from './dto/createLocationBranch.dto';
import {UpdateLocationBranchDto} from './dto/updateLocationBranch.dto';
import {LocationBranch} from './locationBranch.entity';
import {InfoCreateLocationBranchDto} from './dto/infoCreateLocationBranch.dto';
import {InfoUpdateLocationBranchDto} from './dto/infoUpdateLocationBranch.dto';

@Injectable()
export class LocationBranchService {
  constructor(private readonly locationBranchRepository: LocationBranchRepository) {}

  async getBranches(tenantId: number, clientId: string): Promise<LocationBranchDto[]> {
    try {
      const allBranches = await this.locationBranchRepository.getBranches(tenantId, clientId);
      return allBranches.map(({tenantId, locationId, branchId, branch: {name}}) => ({
        tenantId,
        locationId,
        id: branchId,
        name,
      }));
    } catch (error) {
      throw new LocationBranchError.LocationBranchGetAllError(null, error);
    }
  }

  public async createFromInfo(locationBranchToCreate: InfoCreateLocationBranchDto): Promise<LocationBranch> {
    return this.createInternal(locationBranchToCreate);
  }

  public async create(locationBranchToCreate: CreateLocationBranchDto): Promise<LocationBranch> {
    return this.createInternal(locationBranchToCreate);
  }

  private async createInternal(locationBranchToCreate: any): Promise<LocationBranch> {
    try {
      const obj = new LocationBranch();
      obj.branchId = locationBranchToCreate.branchId;
      obj.locationId = locationBranchToCreate.locationId;
      obj.tenantId = locationBranchToCreate.tenantId;
      obj.inTerritory = locationBranchToCreate.inTerritory;

      const newLocationBranch = await this.locationBranchRepository.save(obj);

      return newLocationBranch;
    } catch (error) {
      throw new LocationBranchError.LocationBranchCreateError(null, error);
    }
  }

  async updateFromInfo(locationBranchData: InfoUpdateLocationBranchDto): Promise<LocationBranch> {
    return this.updateInternal(locationBranchData);
  }

  async update(locationBranchData: UpdateLocationBranchDto): Promise<LocationBranch> {
    return this.updateInternal(locationBranchData);
  }

  private async updateInternal(locationBranchData: any): Promise<LocationBranch> {
    try {
      const locationBranch = await this.locationBranchRepository.findOne(
        locationBranchData.tenantId,
        locationBranchData.locationId,
        locationBranchData.branchId,
      );

      locationBranch.inTerritory = locationBranchData.inTerritory;

      const updatedLocationBranch = await this.locationBranchRepository.save(locationBranch);

      return updatedLocationBranch;
    } catch (error) {
      throw new LocationBranchError.LocationBranchCreateError(null, error);
    }
  }
}
