import {ApiProperty} from '@nestjs/swagger';
import {Status} from '../../status/status.entity';
import {Tenant} from '../../tenant/tenant.entity';
import {ConsentDto} from 'src/modules/consent/dto/consent.dto';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';
import {User} from 'src/modules/user/user.entity';
import {Role} from 'src/modules/role/role.entity';
import {DisableReason} from 'src/modules/disableReason/disableReason.entity';
import {TenantUserPermission} from 'src/modules/tenantUserPermission/tenantUserPermission.entity';
import {Notification} from 'src/modules/notification/notification.entity';
import {TenantUserLocation} from 'src/modules/tenantUserLocation/tenantUserLocation.entity';

export class AuthDto {
  @ApiProperty({
    description: 'Tenant id',
    example: 110,
  })
  tenantId: number;

  @ApiProperty({
    description: 'Tenant object',
  })
  tenant: Tenant;

  @ApiProperty({
    description: 'User id',
    example: '00000000-0000-4000-0000-000000000005',
  })
  userId: string;

  @ApiProperty({
    description: 'User object',
  })
  user: User;

  @ApiProperty({
    description: 'Disable reason id',
    example: 1,
  })
  disableReasonId: number;

  @ApiProperty({
    description: 'Disable reason object',
  })
  disableReason: DisableReason;

  @ApiProperty({
    description: 'Other Disable reason',
    example: 'Some reason',
  })
  otherDisableReason: string;

  @ApiProperty({
    description: 'Tenant User role id',
    example: 1,
  })
  roleId: number;

  @ApiProperty({
    description: 'Role object',
  })
  role: Role;

  @ApiProperty({
    description: 'Tenant User status id',
    example: 1,
  })
  statusId: number;

  @ApiProperty({
    description: 'Status object',
  })
  status: Status;

  @ApiProperty({
    description: 'Tenant User deletion date',
    example: '2021-02-02 12:32:00',
  })
  deletionDate: Date;

  @ApiProperty({
    description: 'User unsigned consents',
  })
  unsignedConsents?: ConsentDto[];

  @ApiProperty({
    description: 'Tenant User create date',
    example: '2021-02-02 12:32:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Tenant User update date',
    example: '2021-02-02 12:32:00',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User Worksites ids',
  })
  userWorksitesIds: string[];

  tenantUserPermissions: TenantUserPermission[];
  tenantUserLocations: TenantUserLocation[];
  notifications: Notification[];

  constructor(obj: TenantUser) {
    this.tenantId = obj.tenantId;
    this.tenant = obj.tenant;
    this.userId = obj.userId;
    this.user = obj.user;
    this.disableReasonId = obj.disableReasonId;
    this.disableReason = obj.disableReason;
    this.roleId = obj.roleId;
    this.role = obj.role;
    this.statusId = obj.statusId;
    this.status = obj.status;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.unsignedConsents = null;
    this.userWorksitesIds = null;
    this.tenantUserPermissions = obj.tenantUserPermissions;
    this.tenantUserLocations = obj.tenantUserLocations;
    this.notifications = obj.notifications;
  }
}
