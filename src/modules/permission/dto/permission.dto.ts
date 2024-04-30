import {ApiProperty} from '@nestjs/swagger';
import {PlainObject} from './../../common/common.dto';
import {Permission} from '../permission.entity';

export class PermissionDto {
  @ApiProperty({
    description: 'Permission id',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  id: string;

  @ApiProperty({
    description: 'Permission tenant id',
    example: 110,
  })
  tenantId: number;

  @ApiProperty({
    description: 'Permission tenant object',
  })
  tenant: PlainObject;

  @ApiProperty({
    description: 'Permission name',
    example: 'permission-staffingRequests',
  })
  name: string;

  @ApiProperty({
    description: 'Permission action',
    example: 'write',
  })
  action: string;

  @ApiProperty({
    description: 'Permission created date',
    example: '2021-02-02 12:32:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Permission updated date',
    example: '2021-02-02 12:32:00',
  })
  updatedAt: Date;

  constructor(obj: Permission) {
    this.id = obj.id;
    this.tenantId = obj.tenantId;
    this.tenant = obj.tenant;
    this.name = obj.name;
    this.action = obj.action;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
  }
}
