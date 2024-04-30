import {Column, CreateDateColumn, Entity, UpdateDateColumn, PrimaryColumn} from 'typeorm';

@Entity('Level', {schema: 'public'})
export class Level {
  @PrimaryColumn({type: 'int'})
  public id: number;

  @Column({type: 'text'})
  public entityName: string;

  @Column({type: 'text'})
  public name: string;

  @Column('text')
  public keyName: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Level>) {
    Object.assign(this, data);
  }
}
