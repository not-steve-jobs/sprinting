import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {DepartmentFunction} from '../departmentFunction/departmentFunction.entity';

@Entity('Department')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('text')
  public name: string;

  @Column('text')
  public keyName: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => DepartmentFunction, (fn) => fn.department, {persistence: false})
  @JoinColumn([{name: 'departmentId', referencedColumnName: 'id'}])
  public functions: DepartmentFunction[];

  constructor(data?: Partial<Department>) {
    Object.assign(this, data);
  }
}
