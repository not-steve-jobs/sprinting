import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('Role', {schema: 'public'})
export class Role {
  @PrimaryGeneratedColumn({type: 'integer', name: 'id'})
  public id: number;

  @Column({type: 'text'})
  public name: string;

  @Column('text')
  public keyName: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Role>) {
    Object.assign(this, data);
  }
}
