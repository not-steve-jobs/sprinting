import {Level} from 'src/modules/level/level.entity';
import {LevelEntityEnum} from 'src/modules/level/level.enum';

// Note: Can be moved in the Levels seed at some point
export const filterLevelByEntity = (levels: Level[], entityName: LevelEntityEnum): Level[] => {
  return levels.filter((level: Level) => level.entityName === entityName);
};
