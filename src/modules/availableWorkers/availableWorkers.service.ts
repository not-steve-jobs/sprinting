import {Injectable} from '@nestjs/common';
import {AvailableWorkersDto} from './dto/availableWorkers.dto';
import {AvailableWorkersRepository} from './availableWorkers.repository';
import {AvailableWorkersCacheService} from 'src/appCache/availableWorkersCache.service';

@Injectable()
export class AvailableWorkersService {
  constructor(
    private readonly repository: AvailableWorkersRepository,
    private readonly cache: AvailableWorkersCacheService,
  ) {}

  public async getAvailableWorkersForRole(tenantId: number, jobRoleId: string): Promise<AvailableWorkersDto> {
    let result = this.cache.getByTenantAndRoleId(tenantId, jobRoleId);
    if (result) {
      return result;
    }

    result = await this.repository.fetchAvailableWorkersForRole(tenantId, jobRoleId);
    this.cache.setByTenantAndRoleId(tenantId, jobRoleId, result);
    return result;
  }
}
