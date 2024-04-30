import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsUUID} from 'class-validator';
import {PlainObject} from 'src/modules/common/common.dto';

export class TenantUserLocationDto {
  @IsNumber()
  @ApiProperty({
    description: 'Tenant ID',
    example: 101,
  })
  tenantId: number;

  @IsUUID()
  @ApiProperty({
    description: 'User ID',
    example: 'c87d445b-9c08-404f-bd95-7f54b902e230',
  })
  userId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Location ID',
    example: 'c87d445b-9c08-404f-bd95-7f54b902e230',
  })
  locationId: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;

  constructor(obj: PlainObject) {
    this.tenantId = obj.tenantId;
    this.userId = obj.userId;
    this.locationId = obj.locationId;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
  }
}
