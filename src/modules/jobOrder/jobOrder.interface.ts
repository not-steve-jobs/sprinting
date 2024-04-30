import {FeatureConfigurationFeature} from '../featureConfiguration/enum/featureConfigurationFeature.enum';

export type ServiceTypeNameOption =
  | FeatureConfigurationFeature.CreateJobOrderFormTemporary
  | FeatureConfigurationFeature.CreateJobOrderFormPermanent;

export type JobOrderFields = TemporaryJobOrderFields | PermanentJobOrderFields;

export interface JobOrderCommonFields {
  location: 'locationId';
  branch: 'branchId';
  contractType: 'contractTypeId';
  rate: 'rateId';
  shifts: 'shiftId';
  role: 'jobRoleId';
  sector: 'sectorId';
  days: 'daysInWeek';
  timePicker: ['startTime', 'endTime'];
  experience: 'experienceId';
  timeSheetApprover: 'timeSheetApproverId';
  reportTo: 'reportToId';
  billTo: 'billToId';
  workType: 'workTypeId';
}

export interface TemporaryJobOrderFields extends JobOrderCommonFields {
  dateRange: ['dateStart', 'dateEnd'];
}

export interface PermanentJobOrderFields extends JobOrderCommonFields {
  dateStart: 'dateStart';
}
