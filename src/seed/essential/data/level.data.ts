import {EntityName} from '../../../modules/common/entityName.interface';
import {LevelEnum} from '../../../modules/level/level.enum';
import {Level} from 'src/modules/level/level.entity';

// NOTE: please add new levels at the end of the file and don't change existing IDs
export const levelData: Partial<Level>[] = [
  {id: 1, name: LevelEnum.Beginner, entityName: EntityName.Language},
  {id: 2, name: LevelEnum.Intermediate, entityName: EntityName.Language},
  {id: 3, name: LevelEnum.Advanced, entityName: EntityName.Language},
  {id: 4, name: LevelEnum.Fluent, entityName: EntityName.Language},
  {id: 5, name: LevelEnum.MotherTongue, entityName: EntityName.Language},

  {id: 6, name: LevelEnum.Beginner, entityName: EntityName.Sector},
  {id: 7, name: LevelEnum.Advanced, entityName: EntityName.Sector},
  {id: 8, name: LevelEnum.Expert, entityName: EntityName.Sector},

  {id: 9, name: LevelEnum.Level1, entityName: EntityName.Experience},
  {id: 10, name: LevelEnum.Level2, entityName: EntityName.Experience},
  {id: 11, name: LevelEnum.Level3, entityName: EntityName.Experience},
  {id: 12, name: LevelEnum.Level4, entityName: EntityName.Experience},
  {id: 13, name: LevelEnum.Level5, entityName: EntityName.Experience},
  {id: 14, name: LevelEnum.Level6, entityName: EntityName.Experience},
];
