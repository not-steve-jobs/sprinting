import {MessageRecordType} from '../eventModels';
import {SkillType} from '../eventModels/skill.enum';

export interface createJobSkillsData {
  contactRecordType: MessageRecordType;
  jobId: string;
  skills: SkillData[];
}

export interface SkillData {
  masterSkillType: SkillType;
  skillCode: string;
  levelId?: number;
}
