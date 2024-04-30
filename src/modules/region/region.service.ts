import {Injectable} from '@nestjs/common';
import {RegionDto} from './dto/region.dto';
import {RegionRepository} from './region.repository';

@Injectable()
export class RegionService {
  constructor(private readonly repository: RegionRepository) {}

  public async findAll(tenantId: number): Promise<RegionDto[]> {
    return this.repository.findAll(tenantId);
  }

  public async findDefaultRegion(tenantId: number): Promise<RegionDto> {
    return this.repository.findDefaultRegion(tenantId);
  }
}
