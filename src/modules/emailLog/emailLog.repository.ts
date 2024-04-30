import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {EmailLogStatus} from '../status/status.enum';

import {EmailLog} from './emailLog.entity';

@EntityRepository(EmailLog)
export class EmailLogRepository extends AbstractRepository<EmailLog> {
  /**
   * Simply create a QueryBuilder instance which has to be shared to the query methods of the repository
   *
   * @returns {SelectQueryBuilder<EmailLog>} - An EmailLog QueryBuilder instance
   */
  private q(): SelectQueryBuilder<EmailLog> {
    return this.createQueryBuilder('EmailLog');
  }

  /**
   * Get all pending EmailLog records which were send and not finished (either successfully or failed)
   *
   * @returns {Promise<EmailLog[]>} - Results set with the all Pending EmailLog records
   */
  public async getPending(): Promise<EmailLog[]> {
    const query = await this.q().where('EmailLog.status=:status', {status: EmailLogStatus.Pending}).getMany();

    return query;
  }

  /**
   * Get EmailLog by messageKey
   *
   * @param {string} messageKey
   *
   * @returns {Promise<EmailLog[]>} The result is the first found EmailLog
   */
  public async findOneByMessageKey(messageKey: string): Promise<EmailLog> {
    return this.q().where('EmailLog.messageKey=:messageKey', {messageKey}).getOne();
  }

  /**
   * Create or update an EmailLog entity in the database
   *
   * @param {EmailLog} entity - The EmailLog record which has to be created/updated
   * @returns {Promise<EmailLog>} - Promise with info for the created/updated record
   */
  public async save(entity: EmailLog): Promise<EmailLog> {
    return this.manager.save(entity);
  }

  /**
   * Delete an EmailLog entity from the database
   *
   * @param {EmailLog} entity - The EmailLog record which has to be deleted
   * @returns {Promise<EmailLog>} - Promise with info for the deleted record
   */
  public async delete(entity: EmailLog): Promise<EmailLog> {
    return this.manager.remove(entity);
  }
}
