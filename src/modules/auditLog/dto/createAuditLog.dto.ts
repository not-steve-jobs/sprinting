import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsOptional, IsString, IsUUID} from 'class-validator';
import {AuditLogEntityName, AuditLogOrigin, AuditLogType} from '../auditLog.enum';
import {AuditLogChanges} from '../auditLog.interface';

export class CreateAuditLogDto {
  @IsNumber()
  @ApiProperty({
    description: 'The Tenant ID of the audited entity',
    example: 110,
  })
  tenantId: number;

  @IsString()
  @ApiProperty({
    description: 'The Type of the action which was performed on the entity',
    example: 'JobOrder.Updated',
  })
  type: AuditLogType;

  @IsString()
  @ApiProperty({
    description: 'The Origin of the action (ClientAccess, InFO, Bullhorn, etc.)',
    example: 'ClientAccess',
  })
  origin: AuditLogOrigin;

  @IsUUID()
  @ApiProperty({
    description: 'Entity ID which was changed',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  entityId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Name of the linked Entity which was changed',
    example: 'JobOrder',
  })
  entityName: AuditLogEntityName;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'The User ID who changed the entity (if the action was triggered by a Client Access user)',
    example: '00000000-0000-4000-0000-000000000005',
  })
  userId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "The First Name of the User who changed the entity (InFO user, we don't have his ID in our database)",
    example: 'Melodie',
  })
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "The Last Name of the User who changed the entity (InFO user, we don't have his ID in our database)",
    example: 'King',
  })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'List with details for all changed fields of the entity',
    example: '{attribute:{new:"New Value", old: "Old Value"}}',
  })
  changes: AuditLogChanges;
}
