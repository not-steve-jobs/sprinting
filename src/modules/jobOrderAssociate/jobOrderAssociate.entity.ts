import {JobOrder} from '../jobOrder/jobOrder.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Status} from '../status/status.entity';
import {JobOrderAssociateCase} from '../jobOrderAssociateCase/jobOrderAssociateCase.entity';

@Entity('JobOrderAssociate')
export class JobOrderAssociate {
  @PrimaryColumn('int')
  public tenantId: number;

  @PrimaryColumn('uuid')
  public jobOrderId: string;

  @ManyToOne(() => JobOrder, {persistence: false})
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

  @PrimaryColumn('uuid')
  public userId: string;

  @Column({type: 'integer'})
  public statusId: number;

  @ManyToOne(() => Status, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'statusId',
      referencedColumnName: 'id',
    },
  ])
  public status: Status;

  @OneToMany(() => JobOrderAssociateCase, (joborderassociatecase) => joborderassociatecase.jobOrderAssociate)
  jobOrderAssociateCases: JobOrderAssociateCase[];

  @Column({type: 'boolean', default: false})
  public rejected: boolean;

  @Column({type: 'boolean', default: false})
  public movedBackFromSelect: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({type: 'timestamp', nullable: true})
  public interviewDate: Date;

  constructor(data?: Partial<JobOrderAssociate>) {
    Object.assign(this, data);
  }
}
