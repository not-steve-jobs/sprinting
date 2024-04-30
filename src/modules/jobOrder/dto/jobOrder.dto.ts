import {JobOrderAssociate} from './../../jobOrderAssociate/jobOrderAssociate.entity';
import {PlainObject} from './../../common/common.dto';
import {ApiProperty} from '@nestjs/swagger';
import {IsOptional} from 'class-validator';
import {JobOrder} from '../jobOrder.entity';
import {DaysInWeekEnum} from '../jobOrder.enum';
import {JobOrderAssociateStatus, JobOrderStatus} from 'src/modules/status/status.enum';
import {getNoOfPlacedAssociates} from '../jobOrder.repository';
import {FeatureConfigurationFeature} from 'src/modules/featureConfiguration/enum/featureConfigurationFeature.enum';
import {CloseReasonArgumentsDto} from 'src/modules/closeReasonArguments/dto/closeReasonArguments.dto';
import {FileDto} from 'src/modules/file/dto/file.dto';
import {AuditLog} from 'src/modules/auditLog/auditLog.entity';
import {UserProfileDto} from 'src/modules/userProfile/dto/userProfile.dto';
import {WorkTypeDto} from 'src/modules/workType/dto/workType.dto';

// used to fetch correct createOrderForm feature configuration
export const getFeatureConfigurationFeatureName = (serviceTypeName: string | null) => {
  if (serviceTypeName) {
    return serviceTypeName.toLowerCase().includes('permanent')
      ? FeatureConfigurationFeature.CreateJobOrderFormPermanent
      : FeatureConfigurationFeature.CreateJobOrderFormTemporary;
  }
  return FeatureConfigurationFeature.CreateJobOrderFormTemporary;
};

export class JobOrderDto {
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
    description: 'Username',
    example: 'John Doe',
  })
  userName: string;

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
    description: 'Job order location object',
  })
  location: PlainObject;

  @ApiProperty({
    description: 'Job order branch',
    example: '00000000-0000-4000-0000-000000001101',
  })
  branchId: string;

  @ApiProperty({
    description: 'Job order branch object',
  })
  branch: PlainObject;

  @ApiProperty({
    description: 'Job order service type',
    example: 5,
  })
  serviceTypeId: number;

  @ApiProperty({
    description: 'Job order service type object',
  })
  serviceType: PlainObject;

  @ApiProperty({
    description: 'Job order shift',
    example: 4,
  })
  shiftId: number;

  @ApiProperty({
    description: 'Job order shift object',
  })
  shift: PlainObject;

  @ApiProperty({
    description: 'Job order shift object',
  })
  shifts: PlainObject;

  @ApiProperty({
    description: 'Selected rate for job order',
    example: 8,
  })
  rateId: number;

  @ApiProperty({
    description: 'Selected rate object for job order',
  })
  rate: PlainObject;

  @ApiProperty({
    description: 'Selected employment type for job order',
    example: 3,
  })
  employmentTypeId: number;

  @ApiProperty({
    description: 'Selected employment type object for job order',
  })
  employmentType: PlainObject;

  @ApiProperty({
    description: 'Selected contract type for job order',
    example: 5,
  })
  contractTypeId: number;

  @ApiProperty({
    description: 'Selected contract type object for job order',
  })
  contractType: PlainObject;

  @ApiProperty({
    description: 'Selected role for job order',
    example: '00000000-0000-4000-0000-000000001101',
  })
  jobRoleId: string;

  @ApiProperty({
    description: 'Selected role object for job order',
  })
  jobRole: PlainObject;

  @ApiProperty({
    description: 'Selected role object for job order',
  })
  role: PlainObject;

  @ApiProperty({
    description: 'Selected sector for job order',
    example: '00000000-0000-4000-0000-000000001101',
  })
  sectorId: string;

  @ApiProperty({
    description: 'Selected sector object for job order',
  })
  sector: PlainObject;

  @ApiProperty({
    description: 'Selected sector level for job order',
    example: 2,
  })
  sectorLevelId: number;

  @ApiProperty({
    description: 'Selected sector level object for job order',
  })
  sectorLevel: PlainObject;

  @ApiProperty({
    description: 'Job order status',
    example: 2,
  })
  statusId: number;

  @ApiProperty({
    description: 'Job order status object',
  })
  status: PlainObject;

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

  @ApiProperty({
    description: 'Number of assigned associates',
    example: 2,
  })
  @IsOptional()
  noOfAssociates: number;

  @ApiProperty({
    description: 'Number of placed assigned associates for this order',
    example: 1,
  })
  @IsOptional()
  noOfPlacedAssociates: number;

  @ApiProperty({
    description: 'Number of selected associates for this order (associates with specific statuses)',
    example: 1,
  })
  @IsOptional()
  noOfSelectedAssociates: number;

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
    description: 'Information which form configuration should be used',
    example: 'createJobOrderFormTemporary',
  })
  featureConfigurationFeatureName: string;

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

  @ApiProperty({
    description: 'Selected job order languages',
    example: [],
  })
  jobOrderLanguage: PlainObject;

  @ApiProperty({
    description: 'Selected job order certifications',
    example: [],
  })
  jobOrderCertification: PlainObject;

  @ApiProperty({
    description: 'All JobOrder updates',
    example: [],
  })
  auditLog: AuditLog[];

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

  @ApiProperty({
    description: 'Selected experience object for job order',
  })
  experience: PlainObject;

  @ApiProperty({
    description: 'Reason for closing the order, if it is closed',
  })
  @IsOptional()
  closeReason: CloseReasonArgumentsDto;

  @ApiProperty({
    description: 'Id of user with permission "Time sheet approver"',
  })
  @IsOptional()
  timeSheetApproverId: string;

  @ApiProperty({
    description: 'Selected "Time sheet approver" user profile object for job order',
  })
  @IsOptional()
  timeSheetApprover: UserProfileDto;

  @ApiProperty({
    description: 'Id of user with permission "Report to"',
  })
  @IsOptional()
  reportToId: string;

  @ApiProperty({
    description: 'Selected "Report to" user profile object for job order',
  })
  @IsOptional()
  reportTo: UserProfileDto;

  @ApiProperty({
    description: 'Id of user with permission "Bill to"',
  })
  @IsOptional()
  billToId: string;

  @ApiProperty({
    description: 'Selected "Bill to" user profile object for job order',
  })
  @IsOptional()
  billTo: UserProfileDto;

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
    example: 'Home based',
  })
  @IsOptional()
  workTypeId: number;

  @ApiProperty({
    description: 'Selected work type object for job order',
  })
  @IsOptional()
  workType: WorkTypeDto;

  constructor(
    obj: JobOrder,
    files?: FileDto[],
    orderDetailsListingStatuses?: PlainObject | null,
    tenantName?: string,
    auditLog?: AuditLog[],
  ) {
    //TODO: Remove tenantName when tenant relation is resolved (#2355)
    this.id = obj.id;
    this.name = obj.name;
    this.tenantId = obj.tenantId;
    this.userId = obj.userId;
    this.clientId = obj.clientId;
    this.locationId = obj.locationId;
    this.location = {...obj.location, label: obj?.location?.locationName};
    this.branchId = obj.branchId;
    this.branch = obj.branch;
    if (obj?.branch) {
      const {name} = obj.branch;
      this.branch = {
        ...this.branch,
        name,
        label: name,
      };
    }
    this.serviceTypeId = obj.serviceTypeId;
    this.serviceType = obj.serviceType;
    this.shiftId = obj.shiftId;
    this.shift = obj.shift;
    if (obj?.shift) {
      const {name} = obj.shift;
      this.shift = this.shifts = {
        ...this.shift,
        name,
        label: name,
      };
    }
    this.rateId = obj.rateId;
    this.rate = obj.rate;
    this.employmentTypeId = obj.employmentTypeId;
    this.employmentType = obj.employmentType;
    this.contractTypeId = obj.contractTypeId;
    this.contractType = obj.contractType;
    if (this.contractType) {
      const {name} = obj.contractType;
      this.contractType = {
        ...this.contractType,
        name,
        label: name,
      };
    }
    this.jobRoleId = obj.jobRoleId;
    this.jobRole = obj.jobRole;
    this.sectorId = obj.sectorId;
    this.sector = obj.sector;
    this.sectorLevelId = obj.sectorLevelId;
    this.sectorLevel = obj.level;
    this.statusId = obj.statusId;
    this.status = obj.status;
    this.dateStart = obj.dateStart;
    this.dateEnd = obj.dateEnd;
    this.startTime = obj.startTime;
    this.endTime = obj.endTime;
    this.submissionDate = obj.submissionDate;
    this.numberOfOpenings = obj.numberOfOpenings;
    this.salary = obj.salary;
    this.salaryHigh = obj.salaryHigh;
    this.jobDescription = obj.jobDescription;
    this.dayOneGuidance = obj.dayOneGuidance;
    this.additionalInformation = obj.additionalInformation;
    this.interviewRequired = obj.interviewRequired;
    this.daysInWeek = obj.daysInWeek;
    this.jobOrderLanguage = (obj.jobOrderLanguage ?? []).map(({language, ...rest}) =>
      language
        ? {
            ...rest,
            value: {name: language.name},
          }
        : rest,
    );
    this.jobOrderCertification = (obj.jobOrderCertification ?? []).map(({certification, ...rest}) =>
      certification
        ? {
            ...rest,
            value: {name: certification.name},
          }
        : rest,
    );
    this.auditLog = auditLog ?? [];
    this.uploadedFiles = files;
    this.experienceId = obj.experienceId;
    this.experience = obj.experience;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.noOfAssociates = (obj.jobOrderAssociate ?? []).length;
    this.noOfPlacedAssociates = getNoOfPlacedAssociates(obj.jobOrderAssociate, orderDetailsListingStatuses);
    this.noOfSelectedAssociates = (obj.jobOrderAssociate ?? []).filter((associate: JobOrderAssociate) => {
      if (orderDetailsListingStatuses?.config?.select) {
        return orderDetailsListingStatuses?.config?.select.includes(associate?.status?.name as JobOrderAssociateStatus);
      }
      // if FC wasn't defined, then don't count any candidate
      return false;
    }).length;
    this.userName = '-';
    if (obj?.tenantUser?.user?.userProfile) {
      const {firstName, lastName} = obj.tenantUser.user.userProfile;
      this.userName = `${firstName} ${lastName}`;
    }
    this.role = {};
    if (obj?.jobRole) {
      const {name} = obj.jobRole;
      this.role = {
        name,
        label: name,
      };
    }
    if (this.serviceType) {
      this.featureConfigurationFeatureName = getFeatureConfigurationFeatureName(this.serviceType?.name);
    }
    if (obj.closeReasonArguments) {
      this.closeReason = new CloseReasonArgumentsDto(
        obj.closeReasonArguments,
        obj.status.name === JobOrderStatus.CanceledByTheClient,
        tenantName,
      );
    }
    this.workTypeId = obj.workTypeId;
    this.workType = obj.workType;
    if (obj.timeSheetApproverId) {
      this.timeSheetApproverId = obj.timeSheetApproverId;
      this.timeSheetApprover = obj.timeSheetApprover;
    }
    if (obj.reportToId) {
      this.reportToId = obj.reportToId;
      this.reportTo = obj.reportTo;
    }
    if (obj.billToId) {
      this.billToId = obj.billToId;
      this.billTo = obj.billTo;
    }
  }
}
