import {Injectable} from '@nestjs/common';
import {CaseCategoryCacheService} from 'src/appCache/caseCategoryCache.service';
import {CaseCategory} from './caseCategory.entity';
import {CaseCategoryRepository} from './caseCategory.repository';
import {CaseCategoryDto} from './dto/caseCategory.dto';

@Injectable()
export class CaseCategoryService {
  constructor(
    private readonly caseCategoryRepository: CaseCategoryRepository,
    private readonly cache: CaseCategoryCacheService,
  ) {}

  public async getAll(): Promise<CaseCategoryDto[]> {
    let result = this.cache.getMany();
    if (result) {
      return result;
    }

    result = await this.caseCategoryRepository.findAll();
    this.cache.setMany(result);
    return result;
  }

  public async findOneByName(name: string): Promise<CaseCategory> {
    let result = this.cache.getOneByName(name);
    if (result) {
      return result;
    }

    result = await this.caseCategoryRepository.findOneByName(name);
    this.cache.setOneByName(name, result);
    return result;
  }
}
