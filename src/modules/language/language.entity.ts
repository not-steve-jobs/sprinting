import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('Language')
export class Language {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type: 'varchar', length: 10})
  public code: string;

  @Column({type: 'varchar', length: 255})
  public name: string;

  @Column({type: 'varchar', length: 255})
  public nativeName: string;

  @Column({type: 'varchar'})
  public infoSkillCode: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Language>) {
    Object.assign(this, data);
  }
}
