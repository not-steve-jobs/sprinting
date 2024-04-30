import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import {Tenant} from '../tenant/tenant.entity';

@Entity('Type', {schema: 'public'})
export class Type {
  @PrimaryColumn({type: 'int'})
  public id: number;

  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn({
    name: 'tenantId',
    referencedColumnName: 'id',
  })
  public tenant: Tenant;

  @Column({type: 'text'})
  public entityName: string;

  @Column({type: 'text'})
  public name: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Type>) {
    Object.assign(this, data);
  }
}
