import {ExperienceTransco} from 'src/modules/transformations/entities/experienceTransco.entity';
import {ExperienceTranscoData, TranscoTableData} from 'src/modules/transformations/enums/transformations.types';

export const experienceTranscoData: ExperienceTranscoData[] = [
  {experienceId: 9, yearsOfExperience: '<1 Year'},
  {experienceId: 10, yearsOfExperience: '1-2 Years'},
  {experienceId: 11, yearsOfExperience: '2-5 Years'},
  {experienceId: 12, yearsOfExperience: '5-10 Years'},
  {experienceId: 13, yearsOfExperience: '10-20 Years'},
  {experienceId: 14, yearsOfExperience: '>20 Years'},
  {experienceId: 15, yearsOfExperience: '--None--'},
];

export const experienceTranscoKeys = ['experienceId'];

export const experienceTranscoTableData: TranscoTableData = {
  entity: ExperienceTransco,
  data: experienceTranscoData,
  primaryKeys: experienceTranscoKeys,
};
