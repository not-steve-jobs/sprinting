import {Location} from './../location/location.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {User} from '../user/user.entity';
import {Department} from '../department/department.entity';
import {DepartmentFunction} from '../departmentFunction/departmentFunction.entity';
import {PreferencesDto} from './dto/preferences.dto';

@Entity('UserProfile')
export class UserProfile {
  @PrimaryColumn('uuid')
  public id: string;

  @OneToOne(() => User)
  @JoinColumn([
    {
      name: 'id',
      referencedColumnName: 'id',
    },
  ])
  public user: User;

  @Column({type: 'uuid', nullable: true})
  public mainLocationId: string;

  @OneToOne(() => Location, {persistence: false})
  @JoinColumn({
    name: 'mainLocationId',
    referencedColumnName: 'id',
  })
  public mainLocation: Location;

  @Column({type: 'varchar', length: 255})
  public firstName: string;

  @Column({type: 'varchar', length: 255})
  public lastName: string;

  @Column({type: 'varchar', length: 15})
  public phonePrefix: string;

  @Column({type: 'varchar', length: 255})
  public phone: string;

  @Column({type: 'varchar', length: 15})
  public otherPhonePrefix: string;

  @Column({type: 'varchar', length: 255})
  public otherPhone: string;

  @Column({type: 'varchar', length: 255})
  public language: string;

  @Column({type: 'varchar', length: 255})
  public worksite: string;

  @Column('boolean')
  public dataAccess: boolean;

  @Column({type: 'varchar', length: 255, nullable: true})
  public profileImageUrl: string;

  @Column({type: 'varchar', length: 255})
  public title: string;

  @Column({type: 'uuid', nullable: true})
  public departmentId: string;

  @ManyToOne(() => Department, {persistence: false})
  @JoinColumn({
    name: 'departmentId',
    referencedColumnName: 'id',
  })
  public department: Department;

  @Column({type: 'uuid', nullable: true})
  public departmentFunctionId: string;

  @ManyToOne(() => DepartmentFunction, {persistence: false})
  @JoinColumn({
    name: 'departmentFunctionId',
    referencedColumnName: 'id',
  })
  public departmentFunction: DepartmentFunction;

  @Column({type: 'text', nullable: true})
  public customDepartment?: string;

  @Column({type: 'jsonb', default: {}})
  public preferences: PreferencesDto;

  @Column({type: 'int'})
  public caseCounter: number;

  @Column({type: 'varchar', length: 255})
  public externalContactId: string;

  @Column({type: 'varchar', length: 255})
  public street: string;

  @Column({type: 'varchar', length: 255})
  public street2: string;

  @Column({type: 'varchar', length: 255})
  public city: string;

  @Column({type: 'varchar', length: 255})
  public state: string;

  @Column({type: 'varchar', length: 255})
  public country: string;

  @Column({type: 'varchar', length: 255})
  public zip: string;

  @Column({type: 'varchar', length: 255})
  public escalationTimesheetApprover: string;

  @Column({type: 'varchar', length: 255})
  public billToInvoiceEmail: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<UserProfile>) {
    Object.assign(this, data);
  }
}
