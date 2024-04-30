import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import {Role} from '../role/role.entity';
import {Status} from '../status/status.entity';
import {Tenant} from '../tenant/tenant.entity';
import {User} from '../user/user.entity';
import {DisableReason} from '../disableReason/disableReason.entity';
import {TenantUserPermission} from '../tenantUserPermission/tenantUserPermission.entity';
import {TenantUserLocation} from '../tenantUserLocation/tenantUserLocation.entity';
import {Notification} from '../notification/notification.entity';

@Entity('TenantUser')
export class TenantUser {
  @PrimaryColumn({type: 'integer'})
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'id',
    },
  ])
  public tenant: Tenant;

  @PrimaryColumn({type: 'uuid', name: 'userId'})
  public userId: string;

  @ManyToOne(() => User, {persistence: false})
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'id',
    },
  ])
  public user: User;

  @Column({type: 'integer'})
  public roleId: number;

  @ManyToOne(() => Role, {persistence: false})
  @JoinColumn([
    {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  ])
  role: Role;

  @Column({type: 'integer'})
  public disableReasonId: number;

  @ManyToOne(() => DisableReason, {persistence: false})
  @JoinColumn([
    {
      name: 'disableReasonId',
      referencedColumnName: 'id',
    },
  ])
  public disableReason: DisableReason;

  @Column({type: 'integer', name: 'statusId'})
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

  @Column({type: 'timestamp'})
  public activationDate: Date;

  @Column({type: 'timestamp'})
  public deletionDate: Date;

  @Column({type: 'varchar', length: 255})
  public otherDisableReason: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => TenantUserPermission, (TenantUserPermissionEntry) => TenantUserPermissionEntry.tenantUser, {
    persistence: false,
  })
  @JoinColumn([
    {name: 'userId', referencedColumnName: 'userId'},
    {name: 'tenantId', referencedColumnName: 'tenantId'},
  ])
  public tenantUserPermissions: TenantUserPermission[];

  @OneToMany(() => TenantUserLocation, (TenantUserLocationEntry) => TenantUserLocationEntry.tenantUser, {
    persistence: false,
  })
  @JoinColumn([
    {name: 'userId', referencedColumnName: 'userId'},
    {name: 'tenantId', referencedColumnName: 'tenantId'},
  ])
  public tenantUserLocations: TenantUserLocation[];

  @OneToMany(() => Notification, (notification) => notification.tenantUser, {persistence: false})
  @JoinColumn([
    {name: 'userId', referencedColumnName: 'userId'},
    {name: 'tenantId', referencedColumnName: 'tenantId'},
  ])
  public notifications: Notification[];

  constructor(data?: Partial<TenantUser>) {
    Object.assign(this, data);
  }
}
