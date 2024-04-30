import {ApiProperty} from '@nestjs/swagger';
import {IsOptional} from 'class-validator';
import {PlainObject} from 'src/modules/common/common.dto';

import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {FileDto} from 'src/modules/file/dto/file.dto';

import {DaysInWeekEnum} from 'src/modules/jobOrder/jobOrder.enum';

// used to fetch correct createOrderForm feature configuration
export const getFeatureConfigurationFeatureName = (serviceTypeName: string | null) => {
  if (serviceTypeName) {
    return serviceTypeName.toLowerCase().includes('permanent')
      ? FeatureConfigurationFeature.CreateJobOrderFormPermanent
      : FeatureConfigurationFeature.CreateJobOrderFormTemporary;
  }
  return FeatureConfigurationFeature.CreateJobOrderFormTemporary;
};

export class SeedJobOrderDto {
  @ApiProperty({
    description: 'Job order id',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  id: string;

  @ApiProperty({
    description: 'Job order name',
    example: 'Some name',
  })
  name: string;

  @ApiProperty({
    description: 'Job order tenant id',
    example: 110,
  })
  tenantId: number;

  @ApiProperty({
    description: 'User id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  userId: string;

  @ApiProperty({
    description: 'Client id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  clientId: string;

  @ApiProperty({
    description: 'Job order location id',
  })
  locationId: string;

  @ApiProperty({
    description: 'Job order branch',
    example: '00000000-0000-4000-0000-000000001101',
  })
  branchId: string;

  @ApiProperty({
    description: 'Job order service type',
    example: 5,
  })
  serviceTypeId: number;

  @ApiProperty({
    description: 'Job order shift',
    example: 4,
  })
  shiftId: number;

  @ApiProperty({
    description: 'Selected rate for job order',
    example: 8,
  })
  rateId: number;

  @ApiProperty({
    description: 'Selected employment type for job order',
    example: 3,
  })
  employmentTypeId: number;

  @ApiProperty({
    description: 'Selected contract type for job order',
    example: 5,
  })
  contractTypeId: number;

  @ApiProperty({
    description: 'Selected role for job order',
    example: '00000000-0000-4000-0000-000000001101',
  })
  jobRoleId: string;

  // TODO: Check what is this used for
  @IsOptional()
  @ApiProperty({
    description: 'Selected sector for job order',
    example: '00000000-0000-4000-0000-000000001101',
  })
  sectorId?: string;

  // TODO: Check what is this used for
  @IsOptional()
  @ApiProperty({
    description: 'Selected sector level for job order',
    example: 2,
  })
  sectorLevelId?: number;

  @ApiProperty({
    description: 'Job order status',
    example: 2,
  })
  statusId: number;

  @ApiProperty({
    description: 'Job order start date',
    example: '2021-02-02 12:32:00',
  })
  dateStart: Date;

  @ApiProperty({
    description: 'Job order end date',
    example: '2021-02-02 12:32:00',
  })
  dateEnd: Date;

  @ApiProperty({
    description: 'Job order start time (only time was used from date object)',
    example: '12:30:00',
  })
  startTime: string;

  @ApiProperty({
    description: 'Job order end time (only time was used from date object)',
    example: '19:30:00',
  })
  endTime: string;

  @ApiProperty({
    description: 'Date when job order was submitted',
    example: '2021-02-02 12:32:00',
  })
  submissionDate: Date;

  @ApiProperty({
    description: 'Number of positions required for the job order',
    example: 35,
  })
  numberOfOpenings: number;

  @ApiProperty({
    description: 'Salary',
    example: '1000',
  })
  salary: number;

  @ApiProperty({
    description: 'Salary High',
    example: 1200,
  })
  @IsOptional()
  salaryHigh: number;

  @IsOptional()
  @ApiProperty({
    description: 'Number of assigned associates',
    example: 2,
  })
  noOfAssociates?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Number of placed assigned associates for this order',
    example: 1,
  })
  noOfPlacedAssociates?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Number of selected associates for this order (associates with specific statuses)',
    example: 1,
  })
  noOfSelectedAssociates?: number;

  @ApiProperty({
    description: 'Job description',
    example: 'Some job description',
  })
  jobDescription: string;

  @ApiProperty({
    description: 'Some day one guidance',
    example: "Worker should pick up equipment in 'some address'",
  })
  dayOneGuidance: string;

  @ApiProperty({
    description: 'Some additional information for the job order',
    example: 'Some additional description',
  })
  additionalInformation: string;

  @ApiProperty({
    description: 'Mark if the interview is required or not',
    example: true,
  })
  interviewRequired: boolean;

  @ApiProperty({
    description: 'Select days for which joc order will be active',
    example: ['monday', 'thursday'],
    enum: DaysInWeekEnum,
  })
  daysInWeek: DaysInWeekEnum[];

  // Note: This is no used an maybe can be removed?
  @ApiProperty({
    description: 'Selected job order languages',
    example: [],
  })
  jobOrderLanguage: PlainObject[];

  // Note: This is no used an maybe can be removed?
  @ApiProperty({
    description: 'Selected job order certifications',
    example: [],
  })
  jobOrderCertification: PlainObject[];

  @ApiProperty({
    description: 'Uploaded array of files for job order',
    example: [],
  })
  uploadedFiles: FileDto[];

  @ApiProperty({
    description: 'Mark if job order is rejected',
    example: true,
  })
  rejected: boolean;

  @ApiProperty({
    description: 'Selected experience for job order',
    example: 2,
  })
  experienceId: number;

  @IsOptional()
  @ApiProperty({
    description: 'Id of user with permission "Time sheet approver"',
  })
  @IsOptional()
  timeSheetApproverId?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Id of user with permission "Report to"',
  })
  @IsOptional()
  reportToId?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Id of user with permission "Bill to"',
  })
  @IsOptional()
  billToId?: string;

  @ApiProperty({
    description: 'Job order created date',
    example: '2021-02-02 12:32:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Job order updated date',
    example: '2021-02-02 12:32:00',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Job order work type',
    example: '3',
  })
  @IsOptional()
  workTypeId: number;
}
