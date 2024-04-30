import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {CaseCategory} from 'src/modules/caseCategory/caseCategory.entity';
import {CaseCategoryDto} from 'src/modules/caseCategory/dto/caseCategory.dto';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class CaseCategoryCacheService {
  private readonly name = CacheEntityName.caseCategory;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getMany = (): CaseCategoryDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allCaseCategoryKey();
    return this.nodeCache.get<CaseCategoryDto[]>(key, this.name);
  };

  setMany = (values: CaseCategoryDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allCaseCategoryKey();
    this.nodeCache.set<CaseCategoryDto[]>(key, values, this.name);
  };

  getOneByName = (name: string): CaseCategory | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.caseCategoryNameKey(name);
    return this.nodeCache.get<CaseCategory>(key, this.name);
  };

  setOneByName = (name: string, value: CaseCategory): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.caseCategoryNameKey(name);
    this.nodeCache.set<CaseCategory>(key, value, this.name);
  };

  private allCaseCategoryKey = () => `caseCategory_all`;
  private caseCategoryNameKey = (name: string) => `name_${name}`;
}
