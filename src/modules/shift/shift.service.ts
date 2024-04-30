import {ShiftListDto} from './dto/shiftList.dto';
import {Injectable} from '@nestjs/common';
import {ShiftRepository} from './shift.repository';
import {ShiftCacheService} from 'src/appCache/shiftCache.service';

@Injectable()
export class ShiftService {
  constructor(private readonly repository: ShiftRepository, private readonly cache: ShiftCacheService) {}

  public async getAll(tenantId: number): Promise<ShiftListDto[]> {
    let result = this.cache.getByTenant(tenantId);
    if (result) {
      return result;
    }

    result = await this.repository.getAll(tenantId);
    this.cache.setByTenant(tenantId, result);
    return result;
  }
}
