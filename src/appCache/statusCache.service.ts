import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';
import {StatusDto} from 'src/modules/status/dto/status.dto';
import {Status} from 'src/modules/status/status.entity';

@Injectable()
export class StatusCacheService {
  private readonly name = CacheEntityName.status;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getByTenant = (tenantId: number): StatusDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdKey(tenantId);
    return this.nodeCache.get<StatusDto[]>(key, this.name);
  };

  setByTenant = (tenantId: number, values: StatusDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdKey(tenantId);
    this.nodeCache.set<StatusDto[]>(key, values, this.name);
  };

  getOneByNameAndEntityName = (tenantId: number, name: string, entityName: string): StatusDto | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdNameEntityNameKey(tenantId, name, entityName);
    return this.nodeCache.get<StatusDto>(key, this.name);
  };

  setOneByNameAndEntityName = (tenantId: number, name: string, entityName: string, value: StatusDto): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdNameEntityNameKey(tenantId, name, entityName);
    this.nodeCache.set<StatusDto>(key, value, this.name);
  };

  getOneByIdAndEntityName = (tenantId: number, id: number, entityName: string): StatusDto | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdIdEntityNameKey(tenantId, id, entityName);
    return this.nodeCache.get<StatusDto>(key, this.name);
  };

  setOneByIdAndEntityName = (tenantId: number, id: number, entityName: string, value: StatusDto): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdIdEntityNameKey(tenantId, id, entityName);
    this.nodeCache.set<StatusDto>(key, value, this.name);
  };

  getManyById = (tenantId: number, ids: number[]): Status[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const result = [];
    ids.forEach((id) => {
      const key = this.tenantIdIdKey(tenantId, id);
      const value = this.nodeCache.get<Status[]>(key, this.name);
      if (value) {
        result.push(value);
      }
    });
    return result;
  };

  setManyById = (tenantId: number, values: Status[]): void => {
    if (!this.isEnabled) {
      return;
    }
    values.forEach((value) => {
      const key = this.tenantIdIdKey(tenantId, value.id);
      this.nodeCache.set<Status>(key, value, this.name);
    });
  };

  getOneByEntityName = (tenantId: number, entityName: string): StatusDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdEntityNameKey(tenantId, entityName);
    return this.nodeCache.get<StatusDto[]>(key, this.name);
  };

  setOneByEntityName = (tenantId: number, entityName: string, value: StatusDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdEntityNameKey(tenantId, entityName);
    this.nodeCache.set<StatusDto[]>(key, value, this.name);
  };

  private tenantIdKey = (tenantId: number) => this.nodeCache.parseTenantIdKey(tenantId);
  private tenantIdNameEntityNameKey = (tenantId: number, name: string, entityName: string) =>
    `${this.nodeCache.parseTenantIdKey(tenantId)}_name_${name}_entityName_${entityName}`;
  private tenantIdIdEntityNameKey = (tenantId: number, id: number, entityName: string) =>
    `${this.nodeCache.parseTenantIdKey(tenantId)}_id_${id}_entityName_${entityName}`;
  private tenantIdEntityNameKey = (tenantId: number, entityName: string) =>
    `${this.nodeCache.parseTenantIdKey(tenantId)}_entityName_${entityName}`;
  private tenantIdIdKey = (tenantId: number, id: number) => `${this.nodeCache.parseTenantIdKey(tenantId)}_id_${id}`;
}
