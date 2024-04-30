import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {Consent} from 'src/modules/consent/consent.entity';
import {ConsentType} from 'src/modules/consent/consentType.enum';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class ConsentCacheService {
  private readonly name = CacheEntityName.consent;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getByTenantTypeAndIsMandatory = (tenantId: number, type: ConsentType, isMandatory: boolean): Consent | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdTypeIsMandatoryKey(tenantId, type, isMandatory);
    return this.nodeCache.get<Consent>(key, this.name);
  };

  setByTenantTypeAndIsMandatory = (
    tenantId: number,
    type: ConsentType,
    isMandatory: boolean,
    values: Consent,
  ): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.tenantIdTypeIsMandatoryKey(tenantId, type, isMandatory);
    this.nodeCache.set<Consent>(key, values, this.name);
  };

  private tenantIdTypeIsMandatoryKey = (tenantId: number, type: ConsentType, isMandatory: boolean) =>
    `${this.nodeCache.parseTenantIdKey(tenantId)}_${type}_${isMandatory}`;
}
