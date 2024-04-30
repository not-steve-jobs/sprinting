import {ApiProperty} from '@nestjs/swagger';
import {IsUUID, IsNumber, IsOptional} from 'class-validator';

import {PlainObject} from 'src/modules/common/common.dto';

export class SeedJobOrderAssociateDto {
  @ApiProperty({
    description: 'JobOrder Tenant ID',
    example: 110,
  })
  tenantId: number;

  @IsUUID()
  @ApiProperty({
    description: 'Associate ID',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  public userId: string;

  @IsUUID()
  @ApiProperty({
    description: 'JobOrder ID',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  public jobOrderId: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Status id',
    example: 213,
  })
  public statusId?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Candidate rejected status',
    example: true,
  })
  public rejected?: boolean;

  @IsOptional()
  @ApiProperty({
    description: 'Associate interview date',
    example: '2021-02-02 12:32:00',
  })
  public interviewDate?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Associate creation date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Associate last updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Cases associated with the candidate/associate',
    example: [{caseId: '38413361-cff3-4707-9bcf-1d4ad893a4fc', caseCategoryName: 'Case Category'}],
  })
  public jobOrderAssociateCases?: PlainObject;
}
