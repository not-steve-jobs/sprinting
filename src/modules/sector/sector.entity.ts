import {Tenant} from '../tenant/tenant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';

@Entity('Sector', {schema: 'public'})
export class Sector {
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

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Sector>) {
    Object.assign(this, data);
  }
}
