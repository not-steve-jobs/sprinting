import {EntitySchema, ObjectType} from 'typeorm';

export enum Status {
  IN_PROGRESS = 'In progress',
  CLOSED = 'Closed',
  OPEN = 'Open',
  REOPEN = 'Reopen',
}

export enum CaseStatusDescription {
  IN_PROGRESS = 'In Progress',
  CLOSED = 'Closed',
  OPEN = 'Open',
  REOPEN = 'Reopen',
}

export enum Country {
  POL = 'POL',
  LU = 'LU',
  CH = 'CH',
  AF = 'AF',
  FC = 'FC',
  PL = 'PL',
  US = 'US',
}

export enum Brands {
  ADECCO = 'Adecco',
  FOCORE = 'FOCORE',
}

export enum JobContractType {
  PAYROLL = 'Payroll',
  SHORT_TERM_CONTRACT = 'Short term contract',
  LONG_TERM_CONTRACT = 'Long term contract',
  TEMPORARY_CONTRACT = 'Temporary Contract',
  CIVIL_CONTRACT = 'Civil Contract',
  B2B = 'B2B',
  EMPLOYMENT_CONTRACT = 'Employment Contract',
  TEMP = 'Temp',
  STUDENT_TEMP = 'Student Temp',
  STUDENT_PAYROLL = 'Student Payroll',
}

export enum JobWorkType {
  WORKSITE = 'Worksite based',
  HOME = 'Home based',
  WORKSITE_AND_HOME = 'Worksite and home based',
}

export enum Shifts {
  I_SHIFT = 'I shift',
  II_SHIFTS = 'II shifts',
  III_SHIFTS = 'III shifts',
  CONTINOUS_IV_SHIFTS = 'Continous / IV shifts',
  WORKING_TIME_12H = 'Working time 12hs',
  WEEKENDS_FSS = 'Weekends (fri, sat, sun)',
  AFTERNOON = 'Afternoon',
  MORNING = 'Morning',
  NIGHT = 'Night',
  EVENING = 'Evening',
  SHIFT_2X8 = '2x8',
  SHIFT_3X8 = '3x8',
  SHIFT_4X8 = '4x8',
  DAY = 'Day',
  FRIDAY_AND_WEEKEND = 'Friday & weekend',
  WEEKEND = 'Weekend',
  CUT_OFF = 'Cut-off',
  ROTATING = 'Rotating',
  ALL_DAY = 'All Day',
}

export enum PERIOD {
  HOURLY = 'Hourly',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export enum CLOSED_REASONS {
  FILLED = 'Filled',
  COMPETITOR_FILLED = 'Competitor Filled',
  CLIENT_FILLED = 'Client Filled',
  CANCELLED_BY_CLIENT = 'Cancelled by Client',
  CANCELLED_BY_JOB_OWNER = 'Cancelled by Job Owner',
  SYSTEM_ERROR = 'System Error',
  OTHER = 'Other',
  PARTIALLY_FULFILLED = 'Partially fulfilled',
}

export interface CaseCategoryTranscoData {
  category: number;
  caseReason: string;
  comment: string;
}

export interface CaseStatusTranscoData {
  status: string;
  statusId: number;
  country: string;
  brand: string;
  tenantId: number;
  description: string;
}

export interface LocationAccountTranscoData {
  accountConcernedGuid: null;
  locationId: null;
  category: number;
  description: string;
}

export interface StatusStageTranscoData {
  stage: string;
  country: string;
  brand: string;
  statusId: number;
}

export interface ContractTypeTranscoData {
  contractTypeId: number;
  contractType: string;
  brand: string;
  country: string;
}

export interface JobOrderStatusTranscoData {
  statusId: number;
  status: string;
  brand: string;
  country: string;
}

export interface JobRoleTranscoData {
  jobRoleId: string;
  jobRole: string;
  brand: string;
  country: string;
}

export interface WorkTypeTranscoData {
  workTypeId: number;
  workType: string;
  brand: string;
  country: string;
}

export interface ShiftTranscoData {
  shiftId: number;
  shift: string;
  country: string;
  brand: string;
}
export interface RatePeriodTranscoData {
  rateId: number;
  payRatePeriod: string;
  country: string;
  brand: string;
}
export interface ClosingReasonTranscoData {
  reasonId: number;
  closedReason: string;
  country: string;
  brand: string;
}
export interface LevelSkillTranscoData {
  levelId: number;
  skillLevel: number;
}
export interface ExperienceTranscoData {
  experienceId: number;
  yearsOfExperience: string;
}
export interface ServiceTypeRecordTypeTranscoData {
  serviceTypeId: number;
  recordTypeDeveloperName: string;
  brand: string;
  country: string;
}

export interface RoleTranscoData {
  roleId: number;
  role: string;
}

export interface StatusOutOfBusinessTranscoData {
  status: string;
  outOfBusiness: boolean;
}

export interface Transformation {
  entity: ObjectType<EntitySchema>;
  source: string;
  targetColumnName: string;
  keys: string[];
}

export interface EventsAndCommandsTransformations {
  createClientCase: Transformation[];
  updateClientCase: Transformation[];
  clientCaseUpdated: Transformation[];
  jobProcessCreated: Transformation[];
  jobProcessUpdated: Transformation[];
  updateJobProcess: Transformation[];
  saveContact: Transformation[];
  clientAdminInvited: Transformation[];
  createJob: Transformation[];
  jobCreated: Transformation[];
  jobUpdated: Transformation[];
  jobCreatedNAM: Transformation[];
  createJobSkills: Transformation[];
  jobSkillsCreated: Transformation[];
  jobSkillsUpdated: Transformation[];
  accountUpdated: Transformation[];
}

export type TranscoTableTransformations = Array<
  | CaseCategoryTranscoData
  | CaseStatusTranscoData
  | LocationAccountTranscoData
  | StatusStageTranscoData
  | ContractTypeTranscoData
  | WorkTypeTranscoData
  | ShiftTranscoData
  | RatePeriodTranscoData
  | ClosingReasonTranscoData
  | LevelSkillTranscoData
  | ExperienceTranscoData
  | ServiceTypeRecordTypeTranscoData
  | RoleTranscoData
  | JobOrderStatusTranscoData
  | JobRoleTranscoData
  | StatusOutOfBusinessTranscoData
>;

export interface TranscoTableData {
  entity: ObjectType<EntitySchema>;
  data: TranscoTableTransformations;
  primaryKeys: string[];
}
