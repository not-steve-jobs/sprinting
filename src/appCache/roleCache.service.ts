import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';
import {RoleDto} from 'src/modules/role/dto/role.dto';

@Injectable()
export class RoleCacheService {
  private readonly name = CacheEntityName.role;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getMany = (): RoleDto[] => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.getAllKey();
    return this.nodeCache.get<RoleDto[]>(key, this.name);
  };

  getOneByRoleId = (id: number): RoleDto => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.roleIdKey(id);
    return this.nodeCache.get<RoleDto>(key, this.name);
  };

  getOneByName = (name: string): RoleDto => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.nameKey(name);
    return this.nodeCache.get<RoleDto>(key, this.name);
  };

  setMany = (values: RoleDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.getAllKey();
    this.nodeCache.set<RoleDto[]>(key, values, this.name);
  };

  setOneByRoleId = (value: RoleDto): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.roleIdKey(value.id);
    this.nodeCache.set<RoleDto>(key, value, this.name);
  };

  setOneByName = (value: RoleDto): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.nameKey(value.name);
    this.nodeCache.set<RoleDto>(key, value, this.name);
  };

  private getAllKey = () => 'getAll';
  private roleIdKey = (roleId: number) => `roleId_${roleId}`;
  private nameKey = (name: string) => `name_${name}`;
}
