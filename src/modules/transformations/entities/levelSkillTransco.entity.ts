import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('LevelSkillTransco', {schema: 'transformations'})
export class LevelSkillTransco {
  @PrimaryColumn({type: 'int'})
  public levelId: number;

  @Column({type: 'int'})
  public skillLevel: number;

  constructor(data?: Partial<LevelSkillTransco>) {
    Object.assign(this, data);
  }
}
