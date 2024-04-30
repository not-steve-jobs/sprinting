import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Pagination, PaginationOptions} from '../common/paginate';
import {Notification} from './notification.entity';
import {NotificationEntityName} from './notification.enum';

@EntityRepository(Notification)
export class NotificationRepository extends AbstractRepository<Notification> {
  private q(tenantId: number, userId: string): SelectQueryBuilder<Notification> {
    return this.createQueryBuilder('Notification')
      .where('Notification.userId = :userId', {userId})
      .andWhere('Notification.tenantId = :tenantId', {tenantId});
  }

  /**
   * Fetch a paginated list of the Notification which belongs to a specific User
   * Also includes details for the referenced entities (Case, User) if such are linked with the records
   *
   * @param {number} tenantId - The ID of the Tenant which we want to query
   * @param {string} userId - The ID of the User which we want the notifications to belong to
   * @param {PaginationOptions} paginatorOptions - Specify the pagination rules
   * @returns {Promise<Pagination<Notification>>} - The paginated list of notifications according to the provided params
   */
  public async fetchNotifications(
    tenantId: number,
    userId: string,
    paginatorOptions: PaginationOptions,
  ): Promise<Pagination<Notification>> {
    const query = this.q(tenantId, userId)
      .leftJoinAndSelect('Notification.case', 'Case', 'Notification.entityName = :caseEntityName', {
        caseEntityName: NotificationEntityName.Case,
      })
      .leftJoinAndSelect('Notification.userProfile', 'UserProfile', 'Notification.entityName = :userEntityName', {
        userEntityName: NotificationEntityName.User,
      })
      .take(paginatorOptions.itemsPerPage)
      .skip((paginatorOptions.page - 1) * paginatorOptions.itemsPerPage)
      .orderBy('Notification.updatedAt', 'DESC')
      .getManyAndCount();

    const [results, total] = await query;

    return new Pagination<Notification>({
      results,
      total,
    });
  }

  /**
   * Find a specific Notification record
   *
   * @param {number} tenantId - The ID of Tenant which we want the notification to belong to
   * @param {string} notificationId - The ID of the Notification we're searching for
   * @returns {Promise<Notification>} - The Notification record with all of the details
   */
  public async findOne(tenantId: number, notificationId: string): Promise<Notification> {
    return this.manager.findOne(Notification, {
      where: {
        id: notificationId,
        tenantId,
      },
    });
  }

  /**
   * Find Notifications records according to its linked Case entity
   *
   * @param {number} tenantId - The ID of Tenant which we want the notification to belong to
   * @param {string} caseId - The ID of the Case we want to query
   * @param {string} userId - The ID of the User we want the notification to belong to
   * @returns {Promise<Notification[]>} - The Notifications records with all of the details which meets the requirements
   */
  public async findByCaseId(tenantId: number, caseId: string, userId: string): Promise<Notification[]> {
    return this.manager.find(Notification, {
      where: {
        tenantId,
        entityId: caseId,
        entityName: NotificationEntityName.Case,
        userId,
      },
    });
  }

  public async save(entity: Notification) {
    return this.manager.save(entity);
  }

  public async saveMany(entity: Notification[]) {
    return this.manager.save(entity);
  }

  public async update(entity: Notification, criteria: any) {
    return this.manager.update(this.repository.target, entity, criteria);
  }
  public async deleteMany(entity: Notification[]) {
    return this.manager.remove(entity);
  }

  public async delete(entity: Notification) {
    return this.manager.remove(entity);
  }
}
