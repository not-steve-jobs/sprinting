import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsOptional, IsString, IsUUID} from 'class-validator';
import {AuditLogOrigin, AuditLogType} from '../auditLog.enum';
import {AuditLogChanges} from '../auditLog.interface';

export class JobOrderAuditLogDto {
  @IsString()
  @ApiProperty({
    description: 'The Origin of the action (ClientAccess, InFO, Bullhorn, etc.)',
    example: 'ClientAccess',
  })
  origin: AuditLogOrigin;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The Type of the action (Updated, Cancelled, UnCancelled, etc.)',
    example: 'Updated',
  })
  type?: AuditLogType;

  @IsNumber()
  @ApiProperty({
    description: 'The Tenant ID of the edited Job Order',
    example: 110,
  })
  tenantId: number;

  @IsUUID()
  @ApiProperty({
    description: 'Job Order ID which was edited',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  jobOrderId: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'The User ID who edited the Job Order (if the edit was triggered by a Client Access user)',
    example: '00000000-0000-4000-0000-000000000005',
  })
  userId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      "The First Name of the User who edited the Job Order (InFO user, we don't have hist ID in our database)",
    example: 'Melodie',
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      "The Last Name of the User who edited the Job Order (InFO user, we don't have hist ID in our database)",
    example: 'King',
  })
  lastName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'List with details for all changed fields',
    example: '{attribute:{new:"New Value", old: "Old Value"}}',
  })
  changes: AuditLogChanges;
}
