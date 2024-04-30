import * as dateFns from 'date-fns';
import {Connection} from 'typeorm/connection/Connection';

import {Certification} from 'src/modules/certification/certification.entity';
import {JobOrder} from 'src/modules/jobOrder/jobOrder.entity';
import {JobOrderCertificationDto} from 'src/modules/jobOrderCertification/dto/jobOrderCertification.dto';
import {JobOrderCertification} from 'src/modules/jobOrderCertification/jobOrderCertification.entity';
import {JobOrderCertificationRepository} from 'src/modules/jobOrderCertification/jobOrderCertification.repository';

import {isDebugMode, log, logSuccess} from 'src/seed/utils/seed.utils';
import {getRandomItem} from 'src/seed/utils/helpers';
import {Stopwatch} from 'src/seed/utils/stopwatch';
import {DEMO_END_DATES, DEMO_START_DATES} from '../jobOrder';
import {filterCertificationsByTenant} from '../jobOrder/utils';

/**
 * Seed demo data for the Certifications of the Job Orders
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrder[]} jobOrders - The list with JobOrders for which we want to seed Certifications
 * @param {Certification[]} certifications - List with all available Certifications from which we have to pick a random one
 * @returns {Promise<JobOrderCertification[]>}
 */
export const seedJobOrdersCertifications = async (
  db: Connection,
  jobOrders: JobOrder[],
  certifications: Certification[],
): Promise<JobOrderCertification[]> => {
  log('Seeding Job Order Certifications', 3);
  const stopwatch = new Stopwatch();

  const jobOrdersCertifications: JobOrderCertification[][] = [];
  for (const jobOrder of jobOrders) {
    const createdJobOrderCertifications: JobOrderCertification[] = await seedJobOrderCertifications(
      db,
      jobOrder,
      certifications,
    );
    jobOrdersCertifications.push(createdJobOrderCertifications);
  }

  stopwatch.stopAndLogElapsedTime(`count: ${jobOrdersCertifications.flat().length}`);
  return jobOrdersCertifications.flat();
};

/**
 * Seed demo Certifications for a Job Order
 * Note: Add amount so you can control the number of the seeded certificates
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrder} jobOrder - The JobOrder for which we want to seed the Certification
 * @param {Certification[]} certifications - List with all available Certifications from which we have to pick a random one
 * @returns {Promise<JobOrderCertification[]>}
 */
export const seedJobOrderCertifications = async (
  db: Connection,
  jobOrder: JobOrder,
  certifications: Certification[],
): Promise<JobOrderCertification[]> => {
  const jobOrderCertificationRepository: JobOrderCertificationRepository = db.getCustomRepository(
    JobOrderCertificationRepository,
  );

  const jobOrderCertifications: JobOrderCertification[] = await jobOrderCertificationRepository.findByJobOrderId(
    jobOrder.tenantId,
    jobOrder.id,
  );
  if (jobOrderCertifications.length > 0) {
    return jobOrderCertifications;
  }

  const tenantCertifications: Certification[] = filterCertificationsByTenant(certifications, jobOrder.tenantId);
  return [await seedJobOrderCertification(db, jobOrder, tenantCertifications)];
};

/**
 * Seed demo Certification for a Job Order
 *
 * @param {Connection} db - The active connection with the database
 * @param {JobOrder} jobOrder - The JobOrder for which we want to seed the Certification
 * @param {Certification[]} certifications - List with all available Certifications from which we have to pick a random one
 * @returns {Promise<JobOrderCertification>}
 */
const seedJobOrderCertification = async (
  db: Connection,
  jobOrder: JobOrder,
  certifications: Certification[],
): Promise<JobOrderCertification> => {
  const isDebug = isDebugMode();
  const jobOrderCertificationRepository: JobOrderCertificationRepository = db.getCustomRepository(
    JobOrderCertificationRepository,
  );

  const certification: Certification = getRandomItem(certifications);
  const dateStart: Date = dateFns.parseISO(getRandomItem(DEMO_START_DATES));
  const dateEnd: Date = dateFns.parseISO(getRandomItem(DEMO_END_DATES));

  if (!certification) {
    return;
  }

  const jobOrderCertificationData: JobOrderCertificationDto = {
    tenantId: jobOrder.tenantId,
    jobOrderId: jobOrder.id,
    certificationId: certification?.id,
    dateStart,
    dateEnd,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const jobOrderCertification = new JobOrderCertification();
  Object.assign(jobOrderCertification, jobOrderCertificationData);

  logSuccess(
    `+ Seed JobOrderCertification [#${jobOrderCertification.certificationId}] for JobOrder [${jobOrderCertification.jobOrderId}]`,
    4,
    isDebug,
  );
  return jobOrderCertificationRepository.save(jobOrderCertification);
};
