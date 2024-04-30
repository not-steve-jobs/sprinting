import {AbstractRepository, EntityRepository} from 'typeorm';
import {JobOrderLanguage} from './jobOrderLanguage.entity';

@EntityRepository(JobOrderLanguage)
export class JobOrderLanguageRepository extends AbstractRepository<JobOrderLanguage> {
  public async save(entity: JobOrderLanguage) {
    return this.manager.save(entity);
  }

  /**
   * Sync the JobOrderLanguages related with the provided JobOrder.
   * It simply removes all old relations (it can be changed to be smarter, I'm just moving it now as a separate method)
   * and creates the new records linked with the provided JobOrder
   *
   * @param {number} tenantId - The ID of the Tenant of the JobOrder
   * @param {string} jobOrderId - The ID of the JobOrder to which we want to attach the languages
   * @param {PlainObject[]} languages - List with pairs of Language and Level which should be associated with the provided JobOrder
   * @returns {Promise<JobOrderLanguage[]>} - A list with all of the newly created JobOrderLanguage records
   */
  public async syncJobOrderLanguages(
    tenantId: number,
    jobOrderId: string,
    languages: {languageId: string; levelId: number}[] = [],
  ): Promise<JobOrderLanguage[]> {
    await this.deleteAllLanguages(tenantId, jobOrderId);

    const jobOrderLanguages = languages.map((language) => {
      const languageData: Partial<JobOrderLanguage> = {
        tenantId,
        jobOrderId: jobOrderId,
        languageId: language.languageId,
        levelId: language.levelId,
      };

      const jobOrderLanguage = new JobOrderLanguage(languageData);
      return this.save(jobOrderLanguage);
    });

    return await Promise.all(jobOrderLanguages);
  }

  public async deleteAllLanguages(tenantId: number, jobOrderId: string) {
    return this.createQueryBuilder('JobOrderLanguage')
      .where('jobOrderId = :jobOrderId', {jobOrderId})
      .andWhere('tenantId = :tenantId', {tenantId})
      .delete()
      .execute();
  }

  public async deleteAllJobOrderLanguages(tenantId: number, jobOrderIds: string[]) {
    return jobOrderIds.length
      ? this.createQueryBuilder('JobOrderLanguage')
          .where('jobOrderId IN (:...jobOrderIds)', {jobOrderIds})
          .andWhere('tenantId = :tenantId', {tenantId})
          .delete()
          .execute()
      : '';
  }

  public async findByJobOrderId(tenantId: number, jobOrderId: string): Promise<JobOrderLanguage[]> {
    return this.manager.find(JobOrderLanguage, {where: {tenantId, jobOrderId}});
  }

  public async findOne(tenantId: number, jobOrderId: string, languageId: string) {
    return this.manager.findOne(JobOrderLanguage, {where: {tenantId, jobOrderId, languageId}});
  }

  public async delete(entity: JobOrderLanguage) {
    return this.manager.remove(entity);
  }
}
