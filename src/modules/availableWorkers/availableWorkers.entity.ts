import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {JobRole} from '../jobRole/jobRole.entity';
import {Tenant} from '../tenant/tenant.entity';

@Entity('AvailableWorkers', {schema: 'public'})
export class AvailableWorkers {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type: 'int'})
  public tenantId: number;

  @ManyToOne(() => Tenant)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'id',
    },
  ])
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

  @Column({type: 'integer'})
  public availableWorkers: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<AvailableWorkers>) {
    Object.assign(this, data);
  }
}
