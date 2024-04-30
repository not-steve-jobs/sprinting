import {caseCategoryTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/caseCategoryTransco.data';
import {caseStatusTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/caseStatusTransco.data';
import {closingReasonTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/closingReasonTransco.data';
import {contractTypeTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/contractTypeTransco.data';
import {experienceTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/experienceTransco.data';
import {locationAccountTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/locationAccountTransco.data';
import {ratePeriodTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/ratePeriodTransco.data';
import {serviceTypeRecordTypeTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/serviceTypeRecordTypeTransco.data';
import {shiftTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/shiftTransco.data';
import {statusStageTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/statusStageTransco.data';
import {CaseCategoryTransco} from './entities/CaseCategoryTransco.entity';
import {CaseStatusTransco} from './entities/CaseStatusTransco.entity';
import {ClosingReasonTransco} from './entities/closingReasonTransco.entity';
import {ContractTypeTransco} from './entities/contractTypeTransco.entity';
import {ExperienceTransco} from './entities/experienceTransco.entity';
import {LocationAccountTransco} from './entities/LocationAccountTransco.entity';
import {RoleTransco} from './entities/roleTransco.entity';
import {RatePeriodTransco} from './entities/ratePeriodTransco.entity';
import {ServiceTypeRecordTypeTransco} from './entities/serviceTypeRecordTypeTransco.entity';
import {ShiftTransco} from './entities/shiftTransco.entity';
import {StatusStageTransco} from './entities/statusStageTransco.entity';
import {EventsAndCommandsTransformations} from './enums/transformations.types';
import {LevelSkillTransco} from './entities/levelSkillTransco.entity';
import {levelSkillTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/levelSkillTransco.data';
import {WorkTypeTransco} from './entities/workTypeTransco.entity';
import {JobRoleTransco} from './entities/JobRoleTransco.entity';
import {workTypeTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/workTypeTransco.data';
import {JobOrderStatusTransco} from './entities/JobOrderStatusTransco.entity';
import {StatusOutOfBusinessTransco} from './entities/statusOutOfBusinessTransco.entity';
import {statusOutOfBusinessTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/statusOutOfBusinessTransco.data';
import {roleTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/roleTransco.data';
import {jobOrderStatusTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/jobOrderStatusTransco.data';
import {jobRoleTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/jobRoleTransco.data';

/**
 * In transformations object.
 * Source is the key in which the values is to be assigned.
 * Target is the column name in the database table.
 * We are assigning the values to the source key from the target column.
 */
/**
 *  {
      entity: RoleTransco, // transformation entity which should be used
      source: 'role', // name of property in the result object. e.g. someCommandPayload.role = ...
      targetColumnName: 'role', // transco table column name from which value will be used
      keys: roleTranscoKeys, // PKs for specific transco table. command/event keyValues object must have values for all keys listed in this array
    },
 */
export const EC_Transformations: EventsAndCommandsTransformations = {
  createClientCase: [
    {
      entity: CaseCategoryTransco,
      source: 'category',
      targetColumnName: 'caseReason',
      keys: caseCategoryTranscoKeys,
    },
    {
      entity: LocationAccountTransco,
      source: 'locationId',
      targetColumnName: 'accountConcernedGuid',
      keys: locationAccountTranscoKeys,
    },
  ],
  updateClientCase: [
    {
      entity: CaseStatusTransco,
      source: 'status',
      targetColumnName: 'status',
      keys: caseStatusTranscoKeys,
    },
  ],
  clientCaseUpdated: [
    {
      entity: CaseStatusTransco,
      source: 'statusId',
      targetColumnName: 'statusId',
      keys: caseStatusTranscoKeys,
    },
  ],
  jobProcessCreated: [
    {
      entity: StatusStageTransco,
      source: 'statusId',
      targetColumnName: 'statusId',
      keys: statusStageTranscoKeys,
    },
  ],
  jobProcessUpdated: [
    {
      entity: StatusStageTransco,
      source: 'statusId',
      targetColumnName: 'statusId',
      keys: statusStageTranscoKeys,
    },
  ],
  updateJobProcess: [
    {
      entity: StatusStageTransco,
      source: 'status',
      targetColumnName: 'stage',
      keys: statusStageTranscoKeys,
    },
  ],
  createJob: [
    {
      entity: ContractTypeTransco,
      source: 'contractType',
      targetColumnName: 'contractType',
      keys: contractTypeTranscoKeys,
    },
    {
      entity: JobRoleTransco,
      source: 'jobRole',
      targetColumnName: 'jobRole',
      keys: jobRoleTranscoKeys,
    },
    {
      entity: WorkTypeTransco,
      source: 'workType',
      targetColumnName: 'workType',
      keys: workTypeTranscoKeys,
    },
    {
      entity: RatePeriodTransco,
      source: 'rate',
      targetColumnName: 'payRatePeriod',
      keys: ratePeriodTranscoKeys,
    },
    {
      entity: ServiceTypeRecordTypeTransco,
      source: 'serviceType',
      targetColumnName: 'recordTypeDeveloperName',
      keys: serviceTypeRecordTypeTranscoKeys,
    },
    {
      entity: ShiftTransco,
      source: 'shift',
      targetColumnName: 'shift',
      keys: shiftTranscoKeys,
    },
    {
      entity: ExperienceTransco,
      source: 'experience',
      targetColumnName: 'yearsOfExperience',
      keys: experienceTranscoKeys,
    },
    {
      entity: JobOrderStatusTransco,
      source: 'status',
      targetColumnName: 'status',
      keys: jobOrderStatusTranscoKeys,
    },
    {
      entity: ClosingReasonTransco,
      source: 'reasonClosed',
      targetColumnName: 'closedReason',
      keys: closingReasonTranscoKeys,
    },
  ],
  jobCreated: [
    {
      entity: ContractTypeTransco,
      source: 'contractTypeId',
      targetColumnName: 'contractTypeId',
      keys: [...contractTypeTranscoKeys, 'contractType'],
    },
    {
      entity: RatePeriodTransco,
      source: 'rateId',
      targetColumnName: 'rateId',
      keys: [...ratePeriodTranscoKeys, 'payRatePeriod'],
    },
    {
      entity: ServiceTypeRecordTypeTransco,
      source: 'serviceTypeId',
      targetColumnName: 'serviceTypeId',
      keys: [...serviceTypeRecordTypeTranscoKeys, 'recordTypeDeveloperName'],
    },
    {
      entity: ShiftTransco,
      source: 'shiftId',
      targetColumnName: 'shiftId',
      keys: [...shiftTranscoKeys, 'shift'],
    },
    {
      entity: ExperienceTransco,
      source: 'experienceId',
      targetColumnName: 'experienceId',
      keys: [...experienceTranscoKeys, 'yearsOfExperience'],
    },
  ],
  jobUpdated: [
    {
      entity: ContractTypeTransco,
      source: 'contractTypeId',
      targetColumnName: 'contractTypeId',
      keys: [...contractTypeTranscoKeys, 'contractType'],
    },
    {
      entity: RatePeriodTransco,
      source: 'rateId',
      targetColumnName: 'rateId',
      keys: [...ratePeriodTranscoKeys, 'payRatePeriod'],
    },
    {
      entity: ServiceTypeRecordTypeTransco,
      source: 'serviceTypeId',
      targetColumnName: 'serviceTypeId',
      keys: [...serviceTypeRecordTypeTranscoKeys, 'recordTypeDeveloperName'],
    },
    {
      entity: ShiftTransco,
      source: 'shiftId',
      targetColumnName: 'shiftId',
      keys: [...shiftTranscoKeys, 'shift'],
    },
    {
      entity: ExperienceTransco,
      source: 'experienceId',
      targetColumnName: 'experienceId',
      keys: [...experienceTranscoKeys, 'yearsOfExperience'],
    },
    {
      entity: ClosingReasonTransco,
      source: 'closingReason',
      targetColumnName: 'reasonId',
      keys: [...closingReasonTranscoKeys, 'closedReason'],
    },
  ],
  saveContact: [
    {
      entity: StatusStageTransco,
      source: 'status',
      targetColumnName: 'stage',
      keys: statusStageTranscoKeys,
    },
    {
      entity: RoleTransco,
      source: 'role',
      targetColumnName: 'role',
      keys: roleTranscoKeys,
    },
  ],
  clientAdminInvited: [
    {
      entity: StatusStageTransco,
      source: 'status',
      targetColumnName: 'statusId',
      keys: [...statusStageTranscoKeys, 'stage'],
    },
    {
      entity: RoleTransco,
      source: 'role',
      targetColumnName: 'roleId',
      keys: ['role'],
    },
  ],
  jobCreatedNAM: [
    {
      entity: WorkTypeTransco,
      source: 'workTypeId',
      targetColumnName: 'workTypeId',
      keys: ['country', 'brand', 'workType'],
    },
    {
      entity: ServiceTypeRecordTypeTransco,
      source: 'serviceTypeId',
      targetColumnName: 'serviceTypeId',
      keys: ['country', 'brand', 'recordTypeDeveloperName'],
    },
    {
      entity: JobOrderStatusTransco,
      source: 'statusId',
      targetColumnName: 'statusId',
      keys: statusStageTranscoKeys,
    },
    {
      entity: JobRoleTransco,
      source: 'jobRoleId',
      targetColumnName: 'jobRoleId',
      keys: ['country', 'brand', 'jobRole'],
    },
  ],
  createJobSkills: [
    {
      entity: LevelSkillTransco,
      source: 'level',
      targetColumnName: 'skillLevel',
      keys: levelSkillTranscoKeys,
    },
  ],
  jobSkillsCreated: [
    {
      entity: LevelSkillTransco,
      source: 'levelId',
      targetColumnName: 'levelId',
      keys: [...levelSkillTranscoKeys, 'skillLevel'],
    },
  ],
  jobSkillsUpdated: [
    {
      entity: LevelSkillTransco,
      source: 'levelId',
      targetColumnName: 'levelId',
      keys: [...levelSkillTranscoKeys, 'skillLevel'],
    },
  ],
  accountUpdated: [
    {
      entity: StatusOutOfBusinessTransco,
      source: 'status',
      targetColumnName: 'status',
      keys: [...statusOutOfBusinessTranscoKeys, 'outOfBusiness'],
    },
  ],
};
