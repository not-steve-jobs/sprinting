import {LevelSkillTransco} from 'src/modules/transformations/entities/levelSkillTransco.entity';
import {LevelSkillTranscoData, TranscoTableData} from 'src/modules/transformations/enums/transformations.types';

export const levelSkillTranscoData: LevelSkillTranscoData[] = [
  {levelId: 0, skillLevel: null},
  {levelId: 1, skillLevel: 2},
  {levelId: 2, skillLevel: 3},
  {levelId: 3, skillLevel: 4},
  {levelId: 4, skillLevel: 5},
  {levelId: 5, skillLevel: 6},
];

export const levelSkillTranscoKeys = ['levelId'];

export const levelSkillTranscoTableData: TranscoTableData = {
  entity: LevelSkillTransco,
  data: levelSkillTranscoData,
  primaryKeys: levelSkillTranscoKeys,
};
