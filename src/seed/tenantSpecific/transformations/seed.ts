import {roleTranscoTableData} from './data/roleTransco.data';
import {Connection, EntitySchema, ObjectType} from 'typeorm';

import {log} from 'src/seed/utils/seed.utils';
import {TransformationsRepository} from 'src/modules/transformations/transformations.repository';
import {TranscoTableData, TranscoTableTransformations} from 'src/modules/transformations/enums/transformations.types';

import {caseCategoryTranscoTableData} from './data/caseCategoryTransco.data';
import {caseStatusTranscoTableData} from './data/caseStatusTransco.data';
import {locationAccountTranscoTableData} from './data/locationAccountTransco.data';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {statusStageTranscoTableData} from './data/statusStageTransco.data';
import {contractTypeTranscoTableData} from './data/contractTypeTransco.data';
import {shiftTranscoTableData} from './data/shiftTransco.data';
import {ratePeriodTranscoTableData} from './data/ratePeriodTransco.data';
import {closingReasonTranscoTableData} from './data/closingReasonTransco.data';
import {levelSkillTranscoTableData} from './data/levelSkillTransco.data';
import {experienceTranscoTableData} from './data/experienceTransco.data';
import {serviceTypeRecordTypeTranscoTableData} from './data/serviceTypeRecordTypeTransco.data';
import {workTypeTranscoTableData} from './data/workTypeTransco.data';
import {jobOrderStatusTranscoTableData} from './data/jobOrderStatusTransco.data';
import {jobRoleTranscoTableData} from './data/jobRoleTransco.data';
import {statusOutOfBusinessTranscoTableData} from './data/statusOutOfBusinessTransco.data';

export const transcoTablesData: TranscoTableData[] = [
  caseCategoryTranscoTableData,
  caseStatusTranscoTableData,
  locationAccountTranscoTableData,
  statusStageTranscoTableData,
  contractTypeTranscoTableData,
  workTypeTranscoTableData,
  jobRoleTranscoTableData,
  jobOrderStatusTranscoTableData,
  shiftTranscoTableData,
  ratePeriodTranscoTableData,
  closingReasonTranscoTableData,
  levelSkillTranscoTableData,
  experienceTranscoTableData,
  serviceTypeRecordTypeTranscoTableData,
  roleTranscoTableData,
  statusOutOfBusinessTranscoTableData,
];

export const seedTransformations = async (db: Connection) => {
  log('Seeding Transco Tables Data');
  const stopwatch = new Stopwatch();

  const createdTransformations = await Promise.all(
    transcoTablesData.map(({entity, data, primaryKeys}: TranscoTableData) => {
      return seedTransformationsForEntity(db, entity, data, primaryKeys);
    }),
  );

  stopwatch.stopAndLogElapsedTime(`count: ${createdTransformations.flat().length}`);
  return createdTransformations;
};

export const seedTransformationsForEntity = async (
  db: Connection,
  entity: ObjectType<EntitySchema>,
  transformations: TranscoTableTransformations,
  primaryKeys: string[],
) => {
  const transformationsRepository: TransformationsRepository = db.getCustomRepository(TransformationsRepository);

  return Promise.all(
    transformations.map((data) => {
      return transformationsRepository.upsertData(entity, data, primaryKeys);
    }),
  );
};
