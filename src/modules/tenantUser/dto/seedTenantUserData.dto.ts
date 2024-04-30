import {IsUUID, IsNumber} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class SeedTenantUserDto {
  @IsNumber()
  @ApiProperty({
    description: 'Tenant ID',
    example: 110,
  })
  tenantId: number;

  @IsUUID()
  @ApiProperty({
    description: 'User ID',
    example: 'John00000000-0000-4000-0000-000000110000',
  })
  userId: string;

  @IsNumber()
  @ApiProperty({
    description: 'Role ID',
    example: 1,
  })
  roleId: number;

  @IsNumber()
  @ApiProperty({
    description: 'Status ID',
    example: 123,
  })
  statusId: number;

  @ApiProperty({
    description: 'TenantUser creation date',
    example: '2021-02-02 12:32:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'TenantUser last updated date',
    example: '2021-02-02 12:32:00',
  })
  updatedAt: Date;
}
