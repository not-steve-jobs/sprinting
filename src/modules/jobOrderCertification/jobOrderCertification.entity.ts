import {JobOrder} from '../jobOrder/jobOrder.entity';
import {Certification} from '../certification/certification.entity';
import {Entity, JoinColumn, PrimaryColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, Column} from 'typeorm';

@Entity('JobOrderCertification', {schema: 'public'})
export class JobOrderCertification {
  @PrimaryColumn('uuid')
  public jobOrderId: string;

  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => JobOrder, {persistence: false})
  @JoinColumn([
    {
      name: 'jobOrderId',
      referencedColumnName: 'id',
    },
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
  ])
  public jobOrder: JobOrder;

  @PrimaryColumn('uuid')
  public certificationId: string;

  @ManyToOne(() => Certification, {persistence: false})
  @JoinColumn({
    name: 'certificationId',
    referencedColumnName: 'id',
  })
  public certification: Certification;

  @Index()
  @Column({type: 'timestamp'})
  public dateStart: Date;

  @Index()
  @Column({type: 'timestamp'})
  public dateEnd: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<JobOrderCertification>) {
    Object.assign(this, data);
  }
}
