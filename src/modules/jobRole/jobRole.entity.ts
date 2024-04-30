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

@Entity('JobRole')
export class JobRole {
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

  @Column({type: 'text'})
  public name: string;

  @Column('text')
  public keyName: string;

  @Column({type: 'text', nullable: true})
  public rcCategoryId: string;

  @Column({type: 'varchar'})
  public infoSkillCode: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({type: 'boolean', default: false})
  public isPesSubject: boolean;

  constructor(data?: Partial<JobRole>) {
    Object.assign(this, data);
  }
}
