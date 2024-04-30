import {PermissionListDto} from './dto/permissionList.dto';
import {Injectable} from '@nestjs/common';
import {PermissionRepository} from './permission.repository';
import {PermissionCacheService} from 'src/appCache/permissionCache.service';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly cache: PermissionCacheService,
  ) {}

  /**
   * Retrieves Permission entities by given tenant id and permission names from the database.
   *
   * @param {number} tenantId - Current tenant id to use for filtering
   * @param {string[]} names - Permission names to search for
   * @returns {Promise<Permission[]>} - Promise, retrieving Permission entities
   */
  public async getPermissionsByName(tenantId: number, names: string[]): Promise<PermissionListDto[]> {
    let result = this.cache.getManyByTenantAndName(tenantId, names);
    if (result) {
      return result;
    }

    result = await this.permissionRepository.findManyByName(tenantId, names);
    this.cache.setManyByTenantAndName(tenantId, result);
    return result;
  }
}
