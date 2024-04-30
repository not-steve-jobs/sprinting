import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {Certification} from 'src/modules/certification/certification.entity';
import {CertificationDto} from 'src/modules/certification/dto/certification.dto';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class CertificationCacheService {
  private readonly name = CacheEntityName.certification;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getByTenant = (tenantId: number): CertificationDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allCertificationKey(tenantId);
    return this.nodeCache.get<CertificationDto[]>(key, this.name);
  };

  setByTenant = (tenantId: number, values: CertificationDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allCertificationKey(tenantId);
    this.nodeCache.set<CertificationDto[]>(key, values, this.name);
  };

  getOneBySkillcode = (tenantId: number, skillCode: string): Certification | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.certificationSkillCodeKey(tenantId, skillCode);
    return this.nodeCache.get<Certification>(key, this.name);
  };

  setOneBySkillcode = (tenantId: number, skillCode: string, value: Certification): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.certificationSkillCodeKey(tenantId, skillCode);
    this.nodeCache.set<Certification>(key, value, this.name);
  };

  private allCertificationKey = (tenantId: number) => this.nodeCache.parseTenantIdKey(tenantId);
  private certificationSkillCodeKey = (tenantId: number, skillCode: string) =>
    `${this.nodeCache.parseTenantIdKey(tenantId)}_skillCode_${skillCode}`;
}
