import {TenantUser} from '../tenantUser/tenantUser.entity';
import {Type} from '../type/type.entity';
import {Rate} from '../rate/rate.entity';
import {Location} from '../location/location.entity';
import {Branch} from '../branch/branch.entity';
import {ServiceType} from '../serviceType/serviceType.entity';
import {Shift} from '../shift/shift.entity';
import {JobRole} from '../jobRole/jobRole.entity';
import {Sector} from '../sector/sector.entity';
import {Level} from '../level/level.entity';
import {Status} from '../status/status.entity';
import {Client} from '../client/client.entity';
import {WorkType} from '../workType/workType.entity';
import {JobOrderLanguage} from '../jobOrderLanguage/jobOrderLanguage.entity';
import {JobOrderCertification} from '../jobOrderCertification/jobOrderCertification.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {EmploymentType} from '../employmentType/employmentType.entity';
import {JobOrderAssociate} from '../jobOrderAssociate/jobOrderAssociate.entity';
import {DaysInWeekEnum} from './jobOrder.enum';
import {CloseReasonArguments} from '../closeReasonArguments/closeReasonArguments.entity';
import {UserProfile} from '../userProfile/userProfile.entity';
import {LogAttributeChanges} from '../auditLog/helpers/logAttributeChanges.decorator';
import {LogEntityAttributesChanges} from 'src/modules/auditLog/helpers/logEntityAttributesChanges.mixin';

@Entity('JobOrder')
export class JobOrder extends LogEntityAttributesChanges {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryColumn('int')
  public tenantId: number;

  @Column({type: 'uuid'})
  public clientId: string;

  @ManyToOne(() => Client)
  @JoinColumn({
    name: 'clientId',
    referencedColumnName: 'id',
  })
  public client: Client;

  @Column({type: 'uuid'})
  public userId: string;

  @ManyToOne(() => TenantUser)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'userId',
      referencedColumnName: 'userId',
    },
  ])
  public tenantUser: TenantUser;

  @Index()
  @Column({type: 'varchar', length: 255})
  @LogAttributeChanges<string>()
  public name: string;

  @Column({type: 'uuid'})
  @LogAttributeChanges<string>()
  public locationId: string;

  @ManyToOne(() => Location)
  @JoinColumn([
    {
      name: 'locationId',
      referencedColumnName: 'id',
    },
  ])
  public location: Location;

  @Column({type: 'uuid'})
  @LogAttributeChanges<string>()
  public branchId: string;

  @ManyToOne(() => Branch)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'branchId',
      referencedColumnName: 'id',
    },
  ])
  public branch: Branch;

  @Column({type: 'integer'})
  @LogAttributeChanges<number>()
  public serviceTypeId: number;

  @ManyToOne(() => ServiceType)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'serviceTypeId',
      referencedColumnName: 'id',
    },
  ])
  public serviceType: ServiceType;

  @Column({type: 'integer'})
  @LogAttributeChanges<number>()
  public shiftId: number;

  @ManyToOne(() => Shift)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'shiftId',
      referencedColumnName: 'id',
    },
  ])
  public shift: Shift;

  @Column({type: 'integer'})
  @LogAttributeChanges<number>()
  public rateId: number;

  @ManyToOne(() => Rate)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'rateId',
      referencedColumnName: 'id',
    },
  ])
  public rate: Rate;

  @Column({type: 'integer'})
  @LogAttributeChanges<number>()
  public employmentTypeId: number;

  @ManyToOne(() => EmploymentType)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'employmentTypeId',
      referencedColumnName: 'id',
    },
  ])
  public employmentType: EmploymentType;

  @Column({type: 'integer'})
  @LogAttributeChanges<number>()
  public contractTypeId: number;

  @ManyToOne(() => Type)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'contractTypeId',
      referencedColumnName: 'id',
    },
  ])
  public contractType: Type;

  @Column({type: 'uuid'})
  @LogAttributeChanges<string>()
  public jobRoleId: string;

  @ManyToOne(() => JobRole)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'jobRoleId',
      referencedColumnName: 'id',
    },
  ])
  public jobRole: JobRole;

  @Column({type: 'uuid'})
  @LogAttributeChanges<string>()
  public sectorId: string;

  @ManyToOne(() => Sector)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'sectorId',
      referencedColumnName: 'id',
    },
  ])
  public sector: Sector;

  @Column({type: 'integer'})
  @LogAttributeChanges<number>()
  public sectorLevelId: number;

  @ManyToOne(() => Level)
  @JoinColumn({
    name: 'sectorLevelId',
    referencedColumnName: 'id',
  })
  public level: Level;

  @Column({type: 'integer'})
  @LogAttributeChanges<number>()
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

  @Index()
  @Column({type: 'timestamp with time zone'})
  @LogAttributeChanges<Date>()
  public dateStart: Date;

  @Index()
  @Column({type: 'timestamp with time zone'})
  @LogAttributeChanges<Date>()
  public dateEnd: Date;

  @Index()
  @Column({type: 'time'})
  @LogAttributeChanges<string>()
  public startTime: string;

  @Index()
  @Column({type: 'time'})
  @LogAttributeChanges<string>()
  public endTime: string;

  @Index()
  @Column({type: 'timestamp with time zone'})
  @LogAttributeChanges<Date>()
  public submissionDate: Date;

  @Index()
  @Column({type: 'integer'})
  @LogAttributeChanges<number>()
  public numberOfOpenings: number;

  @Index()
  @Column({type: 'numeric'})
  @LogAttributeChanges<number>()
  public salary: number;

  @Index()
  @Column({type: 'numeric', nullable: true})
  @LogAttributeChanges<number>()
  public salaryHigh: number;

  @Index()
  @Column({type: 'text', nullable: true})
  @LogAttributeChanges<string>()
  public jobDescription: string;

  @Index()
  @Column({type: 'text', nullable: true})
  @LogAttributeChanges<string>()
  public additionalInformation: string;

  @Index()
  @Column({type: 'text', nullable: true})
  @LogAttributeChanges<string>()
  public dayOneGuidance: string;

  @Column({type: 'boolean', nullable: true})
  @LogAttributeChanges<boolean>()
  public interviewRequired: boolean;

  @Column({type: 'enum', enum: Object.values(DaysInWeekEnum), array: true, default: []})
  @LogAttributeChanges<DaysInWeekEnum[]>()
  public daysInWeek: DaysInWeekEnum[];

  @Column({type: 'boolean', default: false})
  @LogAttributeChanges<boolean>()
  public rejected: boolean;

  @OneToMany(() => JobOrderAssociate, (JobOrderAssociateEntry) => JobOrderAssociateEntry.jobOrder, {persistence: false})
  public jobOrderAssociate: JobOrderAssociate[];

  @OneToMany(() => JobOrderLanguage, (JobOrderLanguageEntry) => JobOrderLanguageEntry.jobOrder, {persistence: false})
  public jobOrderLanguage: JobOrderLanguage[];

  @OneToMany(() => JobOrderCertification, (JobOrderCertificationEntry) => JobOrderCertificationEntry.jobOrder, {
    persistence: false,
  })
  public jobOrderCertification: JobOrderCertification[];

  // Note: TypeORM doesn't support polymorphic relationships so we can't define it here and rely on the repository to query those audits
  // @OneToMany(() => AuditLog, (auditLogEntry) => auditLogEntry.jobOrder, {persistence: false})
  // public auditLog: AuditLog[];

  @OneToOne(() => CloseReasonArguments, (CloseReasonArgumentsEntry) => CloseReasonArgumentsEntry.jobOrder, {
    persistence: false,
  })
  public closeReasonArguments: CloseReasonArguments;

  @Column({type: 'boolean', default: true})
  public isDisplayed?: boolean;

  @Column({type: 'integer'})
  @LogAttributeChanges<number>()
  public experienceId: number;

  @ManyToOne(() => Level)
  @JoinColumn({
    name: 'experienceId',
    referencedColumnName: 'id',
  })
  public experience: Level;

  @Column({type: 'uuid'})
  @LogAttributeChanges<string>()
  public timeSheetApproverId?: string;

  @ManyToOne(() => UserProfile)
  @JoinColumn([
    {
      name: 'timeSheetApproverId',
      referencedColumnName: 'id',
    },
  ])
  public timeSheetApprover?: UserProfile;

  @Column({type: 'uuid'})
  @LogAttributeChanges<string>()
  public reportToId?: string;

  @ManyToOne(() => UserProfile)
  @JoinColumn([
    {
      name: 'reportToId',
      referencedColumnName: 'id',
    },
  ])
  public reportTo?: UserProfile;

  @Column({type: 'uuid'})
  @LogAttributeChanges<string>()
  public billToId?: string;

  @ManyToOne(() => UserProfile)
  @JoinColumn([
    {
      name: 'billToId',
      referencedColumnName: 'id',
    },
  ])
  public billTo?: UserProfile;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({type: 'integer'})
  @LogAttributeChanges<number>()
  public workTypeId: number;

  @ManyToOne(() => WorkType)
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'workTypeId',
      referencedColumnName: 'id',
    },
  ])
  public workType: WorkType;

  @Column({type: 'varchar'})
  public externalId: string;

  constructor(data?: Partial<JobOrder>) {
    super();

    Object.assign(this, data);
  }
}
