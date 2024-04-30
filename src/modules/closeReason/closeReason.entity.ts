import {Tenant} from './../tenant/tenant.entity';
import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import {CloseReasonEnum, CloseReasonTypeEnum} from './closeReason.enum';

@Entity('CloseReason')
export class CloseReason {
  @PrimaryColumn({type: 'int'})
  public id: number;

  @PrimaryColumn({type: 'int'})
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn({
    name: 'tenantId',
    referencedColumnName: 'id',
  })
  public tenant: Tenant;

  @Column({type: 'enum', enum: CloseReasonEnum})
  public reason: CloseReasonEnum;

  @Column({type: 'enum', enum: CloseReasonTypeEnum})
  public type: CloseReasonTypeEnum;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<CloseReason>) {
    Object.assign(this, data);
  }
}
