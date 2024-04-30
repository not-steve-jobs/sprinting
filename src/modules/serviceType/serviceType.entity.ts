import {Tenant} from './../tenant/tenant.entity';
import {Column, CreateDateColumn, Entity, JoinColumn, UpdateDateColumn, PrimaryColumn, ManyToOne} from 'typeorm';

@Entity('ServiceType', {schema: 'public'})
export class ServiceType {
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
  public name: string;

  @Column('text')
  public keyName: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<ServiceType>) {
    Object.assign(this, data);
  }
}
