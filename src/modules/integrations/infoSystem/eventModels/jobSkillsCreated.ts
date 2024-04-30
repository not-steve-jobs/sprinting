export interface JobSkillCreatedData {
  jobId: string;
  masterSkillType: string;
  skillCode: string;
  levelId?: number;
  level?: number | null;
}
