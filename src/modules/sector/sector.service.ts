import {SectorListDto} from './dto/sectorList.dto';
import {Injectable} from '@nestjs/common';
import {SectorRepository} from './sector.repository';
import {SectorCacheService} from 'src/appCache/sectorCache.service';

@Injectable()
export class SectorService {
  constructor(private readonly repository: SectorRepository, private readonly cache: SectorCacheService) {}

  public async getAll(tenantId: number): Promise<SectorListDto[]> {
    let result = this.cache.getByTenant(tenantId);
    if (result) {
      return result;
    }

    result = await this.repository.getAll(tenantId);
    this.cache.setByTenant(tenantId, result);
    return result;
  }
}
