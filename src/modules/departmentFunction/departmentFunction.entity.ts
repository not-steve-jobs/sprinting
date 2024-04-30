import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import {Department} from '../department/department.entity';

@Entity('DepartmentFunction')
export class DepartmentFunction {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid')
  public departmentId: string;

  @ManyToOne(() => Department, (department) => department.functions, {persistence: false})
  @JoinColumn([{name: 'departmentId', referencedColumnName: 'id'}])
  public department: Department;

  @Column({type: 'text'})
  public name: string;

  @Column('text')
  public keyName: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<DepartmentFunction>) {
    Object.assign(this, data);
  }
}
