import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';
import {Tenant} from '../tenant/tenant.entity';

@Entity('Permission')
export class Permission {
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

  @Column({type: 'varchar', length: 255, unique: true})
  public name: string;

  @Column({type: 'varchar', length: 255})
  public action: string;

  @Column('int')
  public orderId: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Permission>) {
    Object.assign(this, data);
  }
}
