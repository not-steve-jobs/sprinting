import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {Tenant} from '../tenant/tenant.entity';

@Entity('Region', {schema: 'public'})
export class Region {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type: 'integer'})
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'id',
    },
  ])
  public tenant: Tenant;

  @Column({type: 'text'})
  public name: string;

  @Column({type: 'boolean'})
  public default: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Region>) {
    Object.assign(this, data);
  }
}
