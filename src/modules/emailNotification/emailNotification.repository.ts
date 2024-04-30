import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {PlainObject} from 'src/modules/common/common.dto';
import {EmailNotificationStatus} from 'src/modules/status/status.enum';
import {EmailNotification} from './emailNotification.entity';
import {EmailNotificationType} from './emailNotification.enum';

@EntityRepository(EmailNotification)
export class EmailNotificationRepository extends AbstractRepository<EmailNotification> {
  /**
   * Simply create a QueryBuilder instance which has to be shared to the query methods of the repository
   *
   * @returns {SelectQueryBuilder<EmailNotification>} - An EmailTemplate QueryBuilder instance
   */
  private q(): SelectQueryBuilder<EmailNotification> {
    return this.createQueryBuilder('EmailNotification');
  }

  /**
   * Get all pending EmailNotification for the current Tenant which are due to be send
   *
   * @returns {Promise<EmailNotification[]>} - Results set with the all Pending EmailNotifications for the current Tenant
   */
  public async getPending(): Promise<EmailNotification[]> {
    const query = await this.q()
      .where('EmailNotification.status=:status', {status: EmailNotificationStatus.Pending})
      .andWhere('EmailNotification.sendDate <= :sendDate', {sendDate: new Date()})
      .getMany();

    return query;
  }

  /**
   * Find a specific EmailNotification record
   *
   * @param parameters - A list of simple parameters which can be used to filter out the results (by type, email, status, etc.)
   * @param payloadParameters - A list a parameters which should be queried through the payload field
   * @returns - The EmailTemplate which satisfies the search criteria
   */
  public async findOne(
    parameters: Array<PlainObject> = [],
    payloadParameters: Array<PlainObject> = [],
  ): Promise<EmailNotification> {
    const query = this.q();

    parameters.forEach((parameter: PlainObject) => {
      query.andWhere(`EmailNotification.${parameter.field}=:${parameter.field}`, {[parameter.field]: parameter.value});
    });

    payloadParameters.forEach((parameter: PlainObject) => {
      query.andWhere(`EmailNotification.payload ::jsonb @> :${parameter.field}`, {
        [parameter.field]: {
          [parameter.field]: parameter.value,
        },
      });
    });

    return query.getOne();
  }

  /**
   * Find a specific EmailNotification record within some date range
   *
   * @param {EmailNotificationType} type - notification type
   * @param {Date} from - from date
   * @param {Date} to - to date
   * @returns {Promise<EmailNotification>} - The EmailNotification which satisfies the search criteria
   */
  public async findOneInDateRange(type: EmailNotificationType, from: Date, to: Date): Promise<EmailNotification> {
    const query = this.q()
      .where('"EmailNotification"."type" = :type', {type})
      .andWhere('"EmailNotification"."status" = :status', {status: EmailNotificationStatus.Sent})
      .andWhere('"EmailNotification"."sendDate" BETWEEN :from AND :to', {from, to});
    return query.getOne();
  }

  /**
   * Create or update an EmailNotification entity in the database
   *
   * @param {EmailNotification} entity - The EmailNotification record which has to be created/updated
   * @returns {Promise<EmailNotification>} - Promise with info for the created/updated record
   */
  public async save(entity: EmailNotification): Promise<EmailNotification> {
    return this.manager.save(entity);
  }

  /**
   * Delete an EmailNotification entity from the database
   *
   * @param {EmailNotification} entity - The EmailNotification record which has to be deleted
   * @returns {Promise<EmailNotification>} - Promise with info for the deleted record
   */
  public async delete(entity: EmailNotification): Promise<EmailNotification> {
    return this.manager.remove(entity);
  }
}
