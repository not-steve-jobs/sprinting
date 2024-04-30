import {Connection} from 'typeorm/connection/Connection';

import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {JobOrderLanguageDto} from 'src/modules/jobOrderLanguage/dto/jobOrderLanguage.dto';
import {JobOrderLanguage} from 'src/modules/jobOrderLanguage/jobOrderLanguage.entity';
import {JobOrderLanguageRepository} from 'src/modules/jobOrderLanguage/jobOrderLanguage.repository';
import {Language} from 'src/modules/language/language.entity';
import {Level} from 'src/modules/level/level.entity';
import {LevelEntityEnum} from 'src/modules/level/level.enum';

import {isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {getRandomItem} from 'src/seed/utils/helpers';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {filterLevelByEntity} from './utils';

/**
 * Seed demo data for the Languages of the Job Orders
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrder[]} jobOrders - The list with JobOrders for which we want to seed Languages
 * @param {Language[]} languages - List with all available Languages from which we have to pick a random one
 * @param {Level[]} levels - List with all available Levels from which we have to pick a random one related with the Languages entity
 * @returns {Promise<JobOrderLanguage[]>}
 */
export const seedJobOrdersLanguages = async (
  db: Connection,
  jobOrders: JobOrder[],
  languages: Language[],
  levels: Level[],
): Promise<JobOrderLanguage[]> => {
  log('Seeding Job Order Languages', 3);
  const stopwatch = new Stopwatch();

  const jobOrdersLanguages: JobOrderLanguage[][] = [];
  for (const jobOrder of jobOrders) {
    const createdJobOrderLanguages: JobOrderLanguage[] = await seedJobOrderLanguages(db, jobOrder, languages, levels);
    jobOrdersLanguages.push(createdJobOrderLanguages);
  }

  stopwatch.stopAndLogElapsedTime(`count: ${jobOrdersLanguages.flat().length}`);
  return jobOrdersLanguages.flat();
};

/**
 * Seed demo Languages for a Job Order
 * Note: Add amount so you can control the number of the seeded languages
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrder} jobOrder - The JobOrder for which we want to seed the Language
 * @param {Language[]} languages - List with all available Languages from which we have to pick a random one
 * @param {Level[]} levels - List with all available Levels from which we have to pick a random one related with the Languages entity
 * @returns {Promise<JobOrderLanguage[]>}
 */
export const seedJobOrderLanguages = async (
  db: Connection,
  jobOrder: JobOrder,
  languages: Language[],
  levels: Level[],
): Promise<JobOrderLanguage[]> => {
  const jobOrderLanguageRepository: JobOrderLanguageRepository = db.getCustomRepository(JobOrderLanguageRepository);

  const jobOrderLanguages: JobOrderLanguage[] = await jobOrderLanguageRepository.findByJobOrderId(
    jobOrder.tenantId,
    jobOrder.id,
  );
  if (jobOrderLanguages.length > 0) {
    return jobOrderLanguages;
  }

  const languageLevels: Level[] = filterLevelByEntity(levels, LevelEntityEnum.Language);
  return [await seedJobOrderLanguage(db, jobOrder, languages, languageLevels)];
};

/**
 * Seed demo Language for a Job Order
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrder} jobOrder - The JobOrder for which we want to seed the Language
 * @param {Language[]} languages - List with all available Languages from which we have to pick a random one
 * @param {Level[]} levels - List with all available Language Levels from which we have to pick a random one
 * @returns {Promise<JobOrderLanguage>}
 */
const seedJobOrderLanguage = async (
  db: Connection,
  jobOrder: JobOrder,
  languages: Language[],
  levels: Level[],
): Promise<JobOrderLanguage> => {
  const isDebug = isDebugMode();
  const jobOrderLanguageRepository: JobOrderLanguageRepository = db.getCustomRepository(JobOrderLanguageRepository);

  const language: Language = getRandomItem(languages);
  const level: Level = getRandomItem(levels);

  if (!language || !level) {
    return;
  }

  const jobOrderLanguageData: JobOrderLanguageDto = {
    tenantId: jobOrder.tenantId,
    jobOrderId: jobOrder.id,
    languageId: language?.id,
    levelId: level?.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const jobOrderLanguage = new JobOrderLanguage();
  Object.assign(jobOrderLanguage, jobOrderLanguageData);

  logSuccess(
    `+ Seed JobOrderLanguage [#${jobOrderLanguage.languageId}] for JobOrder [${jobOrderLanguage.jobOrderId}]`,
    4,
    isDebug,
  );
  return jobOrderLanguageRepository.save(jobOrderLanguage);
};
