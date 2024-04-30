import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {DisableReasonEnum} from './disableReason.enum';

@Entity('DisableReason')
export class DisableReason {
  @PrimaryColumn({type: 'int'})
  public id: number;

  @Column({type: 'enum', enum: DisableReasonEnum})
  public reason: DisableReasonEnum;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<DisableReason>) {
    Object.assign(this, data);
  }
}
