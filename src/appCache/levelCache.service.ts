import {Injectable} from '@nestjs/common';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {LevelDto} from 'src/modules/level/dto/level.dto';
import {CacheEntityName} from 'src/modules/nodeCache/nodeCache.enum';
import {NodeCacheService} from 'src/modules/nodeCache/nodeCache.service';

@Injectable()
export class LevelCacheService {
  private readonly name = CacheEntityName.level;
  private readonly isEnabled: boolean;

  constructor(private readonly nodeCache: NodeCacheService, private readonly appConfig: AppConfigService) {
    this.isEnabled = this.nodeCache.isEnabled() && this.appConfig.nodeCache.cachedEntity[this.name] ? true : false;
  }

  getAll = (): LevelDto[] => {
    if (!this.isEnabled) {
      return;
    }
    return this.nodeCache.get<LevelDto[]>(this.allEntityKey(), this.name);
  };

  setAll = (values: LevelDto[]) => {
    if (!this.isEnabled) {
      return;
    }
    this.nodeCache.set<LevelDto[]>(this.allEntityKey(), values, this.name);
  };

  getManyByEntity = (entityName: string): LevelDto[] => {
    if (!this.isEnabled) {
      return;
    }
    return this.nodeCache.get<LevelDto[]>(this.entityNameKey(entityName), this.name);
  };

  setByEntity = (entityName: string, values: LevelDto[]) => {
    if (!this.isEnabled) {
      return;
    }
    this.nodeCache.set<LevelDto[]>(this.entityNameKey(entityName), values, this.name);
  };

  getOneByNameAndEntityName = (levelName: string, entityName: string): LevelDto => {
    if (!this.isEnabled) {
      return;
    }
    return this.nodeCache.get<LevelDto>(this.levelAndEntityKey(levelName, entityName), this.name);
  };

  setOneByNameAndEntity = (levelName: string, entityName: string, value: LevelDto) => {
    if (!this.isEnabled) {
      return;
    }
    this.nodeCache.set<LevelDto>(this.levelAndEntityKey(levelName, entityName), value, this.name);
  };

  private allEntityKey = () => `all`;
  private entityNameKey = (entityName: string) => `entityName_${entityName}`;
  private levelAndEntityKey = (levelName: string, entityName: string) =>
    `levelName_${levelName}_entityName_${entityName}`;
}
