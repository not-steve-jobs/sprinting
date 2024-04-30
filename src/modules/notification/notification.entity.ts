import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {Case} from 'src/modules/case/case.entity';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {UserProfile} from 'src/modules/userProfile/userProfile.entity';

import {NotificationEntityName, NotificationTypeEnum} from './notification.enum';

@Entity('Notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type: 'integer'})
  public tenantId: number;

  @Column({type: 'uuid', name: 'userId'})
  public userId: string;

  @Column({type: 'enum', enum: NotificationTypeEnum})
  public type: NotificationTypeEnum;

  @Column('uuid', {name: 'entityId'})
  public entityId: string;

  @Column('varchar', {name: 'entityName'})
  public entityName: NotificationEntityName;

  @ManyToOne(() => Case, {persistence: false})
  @JoinColumn([
    {
      name: 'entityId',
      referencedColumnName: 'id',
    },
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
  ])
  public case: Case;

  @ManyToOne(() => UserProfile, {persistence: false})
  @JoinColumn([
    {
      name: 'entityId',
      referencedColumnName: 'id',
    },
  ])
  public userProfile: UserProfile;

  @ManyToOne(() => TenantUser, {persistence: false})
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'userId',
    },
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
  ])
  public tenantUser: TenantUser;

  @Column({type: 'boolean'})
  public isRead: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Notification>) {
    Object.assign(this, data);
  }
}
