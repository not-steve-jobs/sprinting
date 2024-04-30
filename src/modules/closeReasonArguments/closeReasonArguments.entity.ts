import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {CloseReason} from '../closeReason/closeReason.entity';
import {JobOrder} from '../jobOrder/jobOrder.entity';
import {Tenant} from '../tenant/tenant.entity';

@Entity('CloseReasonArguments')
export class CloseReasonArguments {
  @PrimaryColumn({type: 'int'})
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn({
    name: 'tenantId',
    referencedColumnName: 'id',
  })
  public tenant: Tenant;

  @PrimaryColumn({type: 'uuid'})
  public jobOrderId: string;

  @OneToOne(() => JobOrder, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'jobOrderId',
      referencedColumnName: 'id',
    },
  ])
  public jobOrder: JobOrder;

  @Column({type: 'int'})
  public closeReasonId: number;

  @ManyToOne(() => CloseReason, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'closeReasonId',
      referencedColumnName: 'id',
    },
  ])
  public closeReason: CloseReason;

  @Column({type: 'uuid'})
  public closedBy: string;

  @Column({type: 'text'})
  public comment: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<CloseReasonArguments>) {
    Object.assign(this, data);
  }
}
