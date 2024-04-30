export interface JobSkillUpdatedData {
  jobId: string;
  masterSkillType: string;
  skillCode: string;
  levelId?: number;
  level?: number | null;
}
