import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {LanguageDto} from 'src/modules/language/dto/language.dto';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class LanguageCacheService {
  private readonly name = CacheEntityName.language;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getMany = (): LanguageDto[] | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allLanguagesKey();
    return this.nodeCache.get<LanguageDto[]>(key, this.name);
  };

  setMany = (value: LanguageDto[]): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.allLanguagesKey();
    this.nodeCache.set(key, value, this.name);
  };

  getByCode = (code: string): LanguageDto | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.keyByCode(code);
    return this.nodeCache.get(key, this.name);
  };

  setByCode = (code: string, value: LanguageDto): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.keyByCode(code);
    this.nodeCache.set(key, value, this.name);
  };

  getBySkillCode = (skillCode: string): LanguageDto | undefined => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.keyBySkillCode(skillCode);
    return this.nodeCache.get(key, this.name);
  };

  setBySkillCode = (skillCode: string, value: LanguageDto): void => {
    if (!this.isEnabled) {
      return;
    }
    const key = this.keyBySkillCode(skillCode);
    this.nodeCache.set(key, value, this.name);
  };

  private allLanguagesKey = () => 'languages_all';
  private keyByCode = (code: string) => `language_code_${code}`;
  private keyBySkillCode = (skillCode: string) => `language_skillcode_${skillCode}`;
}
