import {SharedErrors} from 'src/core/error/shared.error';
import {Injectable} from '@nestjs/common';
import {LevelDto} from './dto/level.dto';
import {LevelRepository} from './level.repository';
import {LevelCacheService} from 'src/appCache/levelCache.service';

@Injectable()
export class LevelService {
  constructor(private readonly repository: LevelRepository, private readonly cache: LevelCacheService) {}

  public async findAll(): Promise<LevelDto[]> {
    let result = this.cache.getAll();
    if (result) {
      return result;
    }

    result = await this.repository.findAll();
    if (!result) {
      throw new SharedErrors.NoEntityNotFoundError({name: 'Level'});
    }
    this.cache.setAll(result);
    return result;
  }

  public async getAllLevelsByEntityName(entityName: string): Promise<LevelDto[]> {
    let result = this.cache.getManyByEntity(entityName);
    if (result) {
      return result;
    }

    result = await this.repository.getAllLevelsByEntityName(entityName);
    this.cache.setByEntity(entityName, result);
    return result;
  }

  public async getLevelByNameAndEntity(entityName: string, levelName: string): Promise<LevelDto> {
    let result = this.cache.getOneByNameAndEntityName(levelName, entityName);
    if (result) {
      return result;
    }

    result = await this.repository.getLevelByNameAndEntity(entityName, levelName);
    this.cache.setOneByNameAndEntity(levelName, entityName, result);
    return result;
  }

  public async deleteLevels(levelIds: number[]) {
    return this.repository.deleteLevels(levelIds);
  }
}
