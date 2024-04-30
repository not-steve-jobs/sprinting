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
import {Tenant} from '../../modules/tenant/tenant.entity';
import {JobRole} from '../jobRole/jobRole.entity';
import {Language} from '../language/language.entity';

@Entity('JobRoleTemplate')
export class JobRoleTemplate {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn({
    name: 'tenantId',
    referencedColumnName: 'id',
  })
  public tenant: Tenant;

  @Column({type: 'uuid'})
  public jobRoleId: string;

  @ManyToOne(() => JobRole)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'jobRoleId',
      referencedColumnName: 'id',
    },
  ])
  public jobRole: JobRole;

  @Column({type: 'uuid'})
  public languageId: string;

  @ManyToOne(() => Language)
  @JoinColumn([
    {
      name: 'languageId',
      referencedColumnName: 'id',
    },
  ])
  public language: Language;

  @Column({type: 'text', nullable: true})
  public template: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<JobRoleTemplate>) {
    Object.assign(this, data);
  }
}
