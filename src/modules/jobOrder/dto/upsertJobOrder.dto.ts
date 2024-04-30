import {
  IsUUID,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
  Matches,
} from 'class-validator';
import {Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {DaysInWeekEnum} from '../jobOrder.enum';

class JobOrderLanguageDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Language id',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  languageId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Level id',
    example: 2,
  })
  levelId: number;
}

class JobOrderCertificationDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Certification id',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  certificationId: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Job order certification start date',
    example: '2021-02-02 12:32:00',
  })
  dateStart?: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Job order certification end date',
    example: '2021-02-02 12:32:00',
  })
  dateEnd?: Date;
}

export class UpsertJobOrderDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Job order id',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  id?: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Client id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  clientId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user who created the job order',
    example: '4d630851-1543-4884-a2e5-192590d492de',
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Job order name',
    example: 'Some name',
  })
  name: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Job order location',
    example: '00000000-0000-4000-0000-000000001101',
  })
  locationId: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Job order branch',
    example: '00000000-0000-4000-0000-000000001101',
  })
  branchId?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Selected contract type for job order',
    example: 5,
  })
  contractTypeId?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Job order status id',
    example: 5,
  })
  statusId?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Selected rate for job order',
    example: 8,
  })
  rateId?: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Job order service type',
    example: 5,
  })
  serviceTypeId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Job order shift',
    example: 4,
  })
  shiftId?: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Selected role for job order',
    example: '00000000-0000-4000-0000-000000001101',
  })
  jobRoleId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Selected sector for job order',
    example: '00000000-0000-4000-0000-000000001101',
  })
  sectorId?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Selected sector level for job order',
    example: 2,
  })
  sectorLevelId?: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Job order start date',
    example: '2021-02-02 12:32:00',
  })
  dateStart: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Job order end date',
    example: '2021-02-02 12:32:00',
  })
  dateEnd?: Date;

  @Matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9])$/)
  @IsOptional()
  @ApiProperty({
    description: 'Job order start time (only time was used from date object)',
    example: '12:30:00',
  })
  startTime?: string;

  @Matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9])$/)
  @IsOptional()
  @ApiProperty({
    description: 'Job order end time (only time was used from date object)',
    example: '19:30:00',
  })
  endTime?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Number of positions required for the job order',
    example: 35,
  })
  numberOfOpenings?: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Salary',
    example: 1000,
  })
  salary: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Salary High',
    example: 1200,
  })
  salaryHigh?: number;

  @IsString()
  @ApiProperty({
    description: 'Job description',
    example: 'Some job description',
  })
  jobDescription?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Some day one guidance',
    example: "Worker should pick up equipment in 'some address'",
  })
  dayOneGuidance?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Some additional information for the job order',
    example: 'Some additional description',
  })
  additionalInformation?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Mark if the interview is required or not',
    example: true,
  })
  interviewRequired?: boolean;

  @IsNotEmpty()
  @IsEnum(DaysInWeekEnum, {each: true})
  @ApiProperty({
    description: 'Select days for which job order will be active',
    example: ['monday', 'thursday'],
    enum: DaysInWeekEnum,
  })
  daysInWeek: DaysInWeekEnum[];

  @ValidateNested({each: true})
  @Type(() => JobOrderLanguageDto)
  @IsOptional()
  @ApiProperty({
    description: 'Selected job order languages',
    example: [],
  })
  languages?: JobOrderLanguageDto[];

  @ValidateNested({each: true})
  @Type(() => JobOrderCertificationDto)
  @IsOptional()
  @ApiProperty({
    description: 'Selected job order certifications',
    example: [],
  })
  certifications?: JobOrderCertificationDto[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Mark if the job order is rejected',
    example: true,
  })
  rejected?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Mark if the job order is displayed inside FE listings ',
    example: true,
  })
  isDisplayed?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Selected experience for job order',
    example: 2,
  })
  experienceId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Reason why job order was closed',
    example: 65,
  })
  closeReasonId?: number;

  @ApiProperty({
    description: 'Id of user with permission "Time sheet approver"',
  })
  @IsOptional()
  timeSheetApproverId?: string;

  @ApiProperty({
    description: 'Id of user with permission "Report to"',
  })
  @IsOptional()
  reportToId?: string;

  @ApiProperty({
    description: 'Id of user with permission "Bill to"',
  })
  @IsOptional()
  billToId?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Job order submission date',
    example: '2021-02-02 12:32:00',
  })
  submissionDate: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Work type',
    example: 4,
  })
  workTypeId?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'External job order id',
    example: 'a4p5w000000IekhAAC',
  })
  externalId?: string;
}

export class UpsertDraftJobOrderDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Job order id',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  id?: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Client id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  clientId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user who created the job order',
    example: '4d630851-1543-4884-a2e5-192590d492de',
  })
  userId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Job order name',
    example: 'Some name',
  })
  name?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Job order location',
    example: '00000000-0000-4000-0000-000000001101',
  })
  locationId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Job order branch',
    example: '00000000-0000-4000-0000-000000001101',
  })
  branchId?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Job order service type',
    example: 6,
  })
  serviceTypeId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Job order shift',
    example: 7,
  })
  shiftId?: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Selected role for job order',
    example: '00000000-0000-4000-0000-000000001101',
  })
  jobRoleId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Selected sector for job order',
    example: '00000000-0000-4000-0000-000000001101',
  })
  sectorId?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Selected sector level for job order',
    example: 2,
  })
  sectorLevelId?: number;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Job order start date',
    example: '2021-02-02 12:32:00',
  })
  dateStart?: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Job order end date',
    example: '2021-02-02 12:32:00',
  })
  dateEnd?: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Number of positions required for the job order',
    example: 35,
  })
  numberOfOpenings?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Salary',
    example: 1000,
  })
  salary?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Salary High',
    example: 1200,
  })
  salaryHigh?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Job description',
    example: 'Some job description',
  })
  jobDescription?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Some day one guidance',
    example: "Worker should pick up equipment in 'some address'",
  })
  dayOneGuidance?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Some additional information for the job order',
    example: 'Some additional description',
  })
  additionalInformation?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Mark if the interview is required or not',
    example: true,
  })
  interviewRequired?: boolean;

  @IsOptional()
  @IsEnum(DaysInWeekEnum, {each: true})
  @ApiProperty({
    description: 'Mark if the interview is required or not',
    example: "['monday', 'thursday']",
    enum: DaysInWeekEnum,
  })
  daysInWeek?: DaysInWeekEnum[];

  @ValidateNested({each: true})
  @Type(() => JobOrderLanguageDto)
  @IsOptional()
  @ApiProperty({
    description: 'Selected job order languages',
    example: [],
  })
  languages?: JobOrderLanguageDto[];

  @ValidateNested({each: true})
  @Type(() => JobOrderCertificationDto)
  @IsOptional()
  @ApiProperty({
    description: 'Selected job order certifications',
    example: [],
  })
  certifications?: JobOrderCertificationDto[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Mark if the job order is rejected',
    example: true,
  })
  rejected: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Selected experience for job order',
    example: 2,
  })
  experienceId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Work type for job order',
    example: 4,
  })
  workTypeId?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'External job order id',
    example: 'a4p5w000000IekhAAC',
  })
  externalId?: string;
}
