import {ApiProperty, IntersectionType} from '@nestjs/swagger';
import {IsUUID, IsNumber, IsOptional} from 'class-validator';
import {CandidateDto} from 'src/modules/aamBackend/dto/candidate.dto';
import {PlainObject} from 'src/modules/common/common.dto';

// TODO: Check this dto, it looks outdated
export class JobOrderAssociatesDto {
  @IsUUID()
  @ApiProperty({
    description: 'Associate id',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  public associateId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Associate name',
    example: 'Robert',
  })
  public name: string;

  @IsNumber()
  @ApiProperty({
    description: 'Associate status',
    example: 'interview',
  })
  public status: string;

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
    description: 'Associate creation date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Cases associated with the candidate/associate',
    example: [{caseId: '38413361-cff3-4707-9bcf-1d4ad893a4fc', caseCategoryName: 'Case Category'}],
  })
  public jobOrderAssociateCases?: PlainObject;
}

export class JobOrderAssociatesWithAamDataDto extends IntersectionType(JobOrderAssociatesDto, CandidateDto) {}
