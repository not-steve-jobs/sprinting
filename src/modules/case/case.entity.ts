import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import {CaseComment} from '../caseComment/caseComment.entity';
import {Status} from '../status/status.entity';
import {Location} from '../location/location.entity';
import {CaseCategory} from '../caseCategory/caseCategory.entity';
import {CaseFollower} from '../caseFollower/caseFollower.entity';
import {TenantUser} from '../tenantUser/tenantUser.entity';

@Entity('Case')
export class Case {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryColumn({type: 'int', name: 'tenantId'})
  public tenantId: number;

  @Column('uuid', {name: 'userId'})
  public userId: string;

  @Column({type: 'uuid', default: null})
  public locationId: string;

  @Column({type: 'integer'})
  public statusId: number;

  @Column({type: 'integer'})
  public caseCategoryId: number;

  @Column({type: 'uuid', default: null})
  public entityId: string;

  @Index()
  @Column({type: 'varchar'})
  public entityName: string;

  @Index()
  @Column({type: 'varchar', nullable: true})
  public description: string;

  @Column({type: 'varchar'})
  public subject: string;

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

  @ManyToOne(() => Location)
  @JoinColumn({
    name: 'locationId',
    referencedColumnName: 'id',
  })
  public location: Location;

  @ManyToOne(() => Status)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'statusId',
      referencedColumnName: 'id',
    },
  ])
  public status: Status;

  @ManyToOne(() => CaseCategory)
  @JoinColumn({
    name: 'caseCategoryId',
    referencedColumnName: 'id',
  })
  public caseCategory: CaseCategory;

  @OneToMany(() => CaseComment, (caseComment) => caseComment.case, {persistence: false})
  @JoinColumn([
    {name: 'id', referencedColumnName: 'caseId'},
    {name: 'tenantId', referencedColumnName: 'tenantId'},
  ])
  public comments: CaseComment[];

  @OneToMany(() => CaseFollower, (caseFollower) => caseFollower.case, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'id',
      referencedColumnName: 'caseId',
    },
  ])
  public caseFollowers: CaseFollower[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Case>) {
    Object.assign(this, data);
  }
}
