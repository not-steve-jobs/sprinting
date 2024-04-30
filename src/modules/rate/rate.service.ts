import {RateListDto} from './dto/rateList.dto';
import {Injectable} from '@nestjs/common';
import {RateRepository} from './rate.repository';
import {RateCacheService} from 'src/appCache/rateCache.service';

@Injectable()
export class RateService {
  constructor(private readonly repository: RateRepository, private readonly cache: RateCacheService) {}

  public async getAll(tenantId: number): Promise<RateListDto[]> {
    let result = this.cache.getByTenant(tenantId);
    if (result) {
      return result;
    }

    result = await this.repository.getTenantRates(tenantId);
    this.cache.setByTenant(tenantId, result);
    return result;
  }
}
