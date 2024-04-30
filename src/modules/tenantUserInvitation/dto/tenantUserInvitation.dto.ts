import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsUUID, IsDate, IsOptional, IsNumber, IsBoolean} from 'class-validator';
import {TenantUser} from 'src/modules/tenantUser/tenantUser.entity';

export class TenantUserInvitationDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Invitation id',
    example: 'f26421e1-0df4-494b-9fde-11ccad6bdf52',
  })
  id?: string;

  @IsNumber()
  @ApiProperty({
    description: 'Invited tenant id',
    example: 110,
  })
  tenantId: number;

  @ApiProperty({
    description: 'Tenant User object',
  })
  tenantUser: TenantUser;

  @IsUUID()
  @ApiProperty({
    description: 'Invited user id',
    example: '42b43902-5c40-4bb7-8e38-80564f8340a1',
  })
  userId: string;

  @IsString()
  @ApiProperty({
    description: 'Invitation user email address',
    example: 'user@adeccogroup.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Invitation url',
    example: 'http://localhost:3001/invitation/a596c3d7-d9e9-43b0-8e0e-25717cbed424',
  })
  invitationLink?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Invitation expiration date',
    example: '2021-03-01 23:48:37',
  })
  dateExpiry?: Date;

  @IsBoolean()
  @ApiProperty({
    description: 'Invitation active status',
    example: false,
  })
  isActive?: boolean;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Date on which the invitation was accepted',
    example: '2021-03-01 23:48:37',
  })
  acceptedAt?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Created date',
    example: '2021-03-01 23:48:37',
  })
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Date of the last update ',
    example: '2021-03-01 23:48:37',
  })
  updatedAt?: Date;
}
