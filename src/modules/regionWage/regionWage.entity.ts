import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import {JobRole} from '../jobRole/jobRole.entity';
import {Level} from '../level/level.entity';
import {Region} from '../region/region.entity';
import {Tenant} from '../tenant/tenant.entity';

@Entity('RegionWage', {schema: 'public'})
export class RegionWage {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'id',
    },
  ])
  public tenant: Tenant;

  @Column({type: 'uuid'})
  public regionId: string;

  @ManyToOne(() => Region)
  @JoinColumn([
    {
      name: 'regionId',
      referencedColumnName: 'id',
    },
  ])
  public region: Region;

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
  public experienceLevelId: number;

  @ManyToOne(() => Level)
  @JoinColumn({
    name: 'experienceLevelId',
    referencedColumnName: 'id',
  })
  public experienceLevel: Level;

  @Column({type: 'real'})
  public minimum: number;

  @Column({type: 'real'})
  public suggested: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Region>) {
    Object.assign(this, data);
  }
}
