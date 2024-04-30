import {Tenant} from './../tenant/tenant.entity';
import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
@Entity('Status', {schema: 'public'})
export class Status {
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

  constructor(data?: Partial<Status>) {
    Object.assign(this, data);
  }
}
