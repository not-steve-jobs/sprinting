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

@Entity('CaseComment')
export class CaseComment {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryColumn({type: 'int', name: 'tenantId'})
  public tenantId: number;

  @Column('uuid', {name: 'userId'})
  public userId: string;

  @Column({type: 'uuid'})
  public caseId: string;

  @Column({type: 'varchar'})
  public value: string;

  @Column({type: 'boolean', default: false})
  public isDraft: boolean;

  @Column({type: 'boolean', default: false})
  public filesDeleted: boolean;

  @Column({type: 'varchar'})
  public userName: string;

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

  constructor(data?: Partial<CaseComment>) {
    Object.assign(this, data);
  }
}
