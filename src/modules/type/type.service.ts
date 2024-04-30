import {Injectable} from '@nestjs/common';
import {TypeRepository} from './type.repository';
import {TypeDto} from './dto/type.dto';
import {TypeCacheService} from 'src/appCache/typeCache.service';

@Injectable()
export class TypeService {
  constructor(private readonly typeRepository: TypeRepository, private readonly cache: TypeCacheService) {}

  public async getAll(tenantId: number): Promise<TypeDto[]> {
    let result = this.cache.getByTenant(tenantId);
    if (result) {
      return result;
    }

    result = await this.typeRepository.getAll(tenantId);
    this.cache.setByTenant(tenantId, result);
    return result;
  }
}
