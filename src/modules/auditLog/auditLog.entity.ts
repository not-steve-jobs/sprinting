import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {UserProfile} from 'src/modules/userProfile/userProfile.entity';

import {AuditLogEntityName, AuditLogOrigin, AuditLogType} from './auditLog.enum';
import {AuditLogChanges} from './auditLog.interface';
import {CreateAuditLogDto} from './dto/createAuditLog.dto';

@Entity('AuditLog', {schema: 'public'})
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('int')
  public tenantId: number;

  @Column('varchar')
  public type: AuditLogType;

  @Column('varchar')
  public origin: AuditLogOrigin;

  @Column('uuid')
  public entityId: string;

  @Column('varchar')
  public entityName: AuditLogEntityName;

  // Note: TypeORM doesn't support polymorphic fields so we can't define the relationship here in the entity and we use the repository instead
  // @ManyToOne(() => JobOrder, {persistence: false})
  // public jobOrder: JobOrder;

  @Column('uuid')
  public userId: string;

  @ManyToOne(() => UserProfile, {persistence: false})
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'id',
    },
  ])
  public userProfile: UserProfile;

  @Column('varchar')
  public firstName: string;

  @Column('varchar')
  public lastName: string;

  @Column({type: 'jsonb', nullable: true})
  public changes: AuditLogChanges;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: CreateAuditLogDto | AuditLog) {
    Object.assign(this, data);
  }
}
