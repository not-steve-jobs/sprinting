interface IKeyValuePair {
  [key: string]: string;
}

interface ICategory {
  id: string;
  localeId: string;
}

interface UserSkillDTO {
  skillId: string;
  name: string;
  category: ICategory;
  level: ICategory;
  years: number;
  months: number;
  isVerified: boolean;
}

export class GetAllUserSkillResponseMessageDto {
  userSkills: UserSkillDTO[];
  categories: IKeyValuePair[];
  levels: IKeyValuePair[];
  languageLevels: IKeyValuePair[];

  constructor(data?: Partial<GetAllUserSkillResponseMessageDto>) {
    Object.assign(this, data);
  }
}
