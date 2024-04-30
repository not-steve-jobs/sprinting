import {Injectable} from '@nestjs/common';
import {LanguageCacheService} from 'src/appCache/languageCache.service';
import {LanguageDto} from './dto/language.dto';
import {LanguageRepository} from './language.repository';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepository: LanguageRepository, private readonly cache: LanguageCacheService) {}

  public async findOneBySkillCode(skillCode: string): Promise<LanguageDto> {
    let result = this.cache.getBySkillCode(skillCode);
    if (result) {
      return result;
    }

    result = await this.languageRepository.getBySkillCode(skillCode);
    this.cache.setBySkillCode(skillCode, result);
    return result;
  }

  public async findOneByCode(code: string): Promise<LanguageDto> {
    let result = this.cache.getByCode(code);
    if (result) {
      return result;
    }

    result = await this.languageRepository.getByCode(code);
    this.cache.setByCode(code, result);
    return result;
  }

  public async getAll(): Promise<LanguageDto[]> {
    let result = this.cache.getMany();
    if (result) {
      return result;
    }

    result = await this.languageRepository.findAll();
    this.cache.setMany(result);
    return result;
  }
}
