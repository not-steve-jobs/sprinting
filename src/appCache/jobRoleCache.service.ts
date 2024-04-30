import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {JobRole} from 'src/modules/jobRole/jobRole.entity';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class JobRoleCacheService {
  private readonly name = CacheEntityName.jobRole;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getByTenant = (tenantId: number): JobRole[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    return this.nodeCache.get<JobRole[]>(this.tenantKey(tenantId), this.name);
  };

  getOneByTenantAndSkillCode = (tenantId: number, skillCode: string): JobRole | undefined => {
    if (!this.isEnabled) {
      return;
    }
    return this.nodeCache.get<JobRole>(this.tenantAndSkillCodeKey(tenantId, skillCode), this.name);
  };

  getOneByTenantAndRoleId = (tenantId: number, roleId: string): JobRole | undefined => {
    if (!this.isEnabled) {
      return;
    }
    return this.nodeCache.get<JobRole>(this.tenantAndRoleIdKey(tenantId, roleId), this.name);
  };

  setByTenant = (tenantId: number, values: JobRole[]): void => {
    if (!this.isEnabled) {
      return;
    }
    this.nodeCache.set<JobRole[]>(this.tenantKey(tenantId), values, this.name);
  };

  setByTenantAndSkillCodeKey = (tenantId: number, skillCode: string, value: JobRole): void => {
    if (!this.isEnabled) {
      return;
    }
    this.nodeCache.set<JobRole>(this.tenantAndSkillCodeKey(tenantId, skillCode), value, this.name);
  };

  setByTenantAndRoleIdKey = (tenantId: number, roleId: string, value: JobRole): void => {
    if (!this.isEnabled) {
      return;
    }
    this.nodeCache.set<JobRole>(this.tenantAndRoleIdKey(tenantId, roleId), value, this.name);
  };

  private tenantKey = (tenantId: number) => this.nodeCache.parseTenantIdKey(tenantId);
  private tenantAndSkillCodeKey = (tenantId: number, skillCode: string) =>
    this.nodeCache.parseKey(tenantId, `skillcode_${skillCode}`);
  private tenantAndRoleIdKey = (tenantId: number, roleId: string) =>
    this.nodeCache.parseKey(tenantId, `roleId_${roleId}`);
}
