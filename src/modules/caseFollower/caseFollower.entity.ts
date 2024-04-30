import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Case} from '../case/case.entity';
import {TenantUser} from '../tenantUser/tenantUser.entity';

@Entity('CaseFollower')
export class CaseFollower {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryColumn({type: 'int', name: 'tenantId'})
  public tenantId: number;

  @Column('uuid', {name: 'userId'})
  public userId: string;

  @Column('uuid', {name: 'caseId'})
  public caseId: string;

  @Column({type: 'boolean'})
  public isCaseRead: boolean;

  @Column({type: 'boolean', default: false})
  public isUserFollower: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => TenantUser, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'userId',
      referencedColumnName: 'userId',
    },
  ])
  public tenantUser: TenantUser;

  @ManyToOne(() => Case, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'caseId',
      referencedColumnName: 'id',
    },
  ])
  public case: Case;

  constructor(data?: Partial<CaseFollower>) {
    Object.assign(this, data);
  }
}
