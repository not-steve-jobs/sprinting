import {CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {Case} from '../case/case.entity';
import {JobOrderAssociate} from '../jobOrderAssociate/jobOrderAssociate.entity';

@Entity('JobOrderAssociateCase')
export class JobOrderAssociateCase {
  @PrimaryColumn('int')
  public tenantId: number;

  @PrimaryColumn('uuid')
  public userId: string;

  @PrimaryColumn('uuid')
  public jobOrderId: string;

  @ManyToOne(() => JobOrderAssociate)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'userId',
      referencedColumnName: 'userId',
    },
    {
      name: 'jobOrderId',
      referencedColumnName: 'jobOrderId',
    },
  ])
  public jobOrderAssociate: JobOrderAssociate;

  @PrimaryColumn('uuid')
  public caseId: string;
  @OneToOne(() => Case)
  @JoinColumn([
    {
      name: 'caseId',
      referencedColumnName: 'id',
    },
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
  ])
  public case: Case;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<JobOrderAssociate>) {
    Object.assign(this, data);
  }
}
