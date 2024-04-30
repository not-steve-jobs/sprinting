import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('ExperienceTransco', {schema: 'transformations'})
export class ExperienceTransco {
  @PrimaryColumn({type: 'int'})
  public experienceId: number;

  @Column({type: 'varchar', length: 255})
  public yearsOfExperience: number;

  constructor(data?: Partial<ExperienceTransco>) {
    Object.assign(this, data);
  }
}
