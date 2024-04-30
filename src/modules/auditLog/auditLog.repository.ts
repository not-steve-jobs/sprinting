import {AbstractRepository, EntityRepository} from 'typeorm';

import {AuditLog} from './auditLog.entity';
import {AuditLogEntityName} from './auditLog.enum';

@EntityRepository(AuditLog)
export class AuditLogRepository extends AbstractRepository<AuditLog> {
  /**
   * Find all AuditLog records related with a specific entity
   *
   * @param {number} tenantId - The Tenant ID of the logged entity
   * @param {string} entityId - The ID of the entity which should be used to filter the logs
   * @param {string} entityName - The log is polymorphic so we need to know the name of the entity, not only its ID
   * @returns {{Promise<AuditLog[]>}}
   */
  public async find(tenantId: number, entityId: string, entityName: AuditLogEntityName): Promise<AuditLog[]> {
    const relations = ['userProfile'];

    return this.manager.find(AuditLog, {
      where: {
        tenantId,
        entityId,
        entityName,
      },
      relations,
    });
  }

  /**
   * Save a new AuditLog record to the database
   *
   * @param {AuditLog} entity - The entity with all of the data for the new record
   * @returns {Promise<AuditLog>}
   */
  public async save(entity: AuditLog): Promise<AuditLog> {
    return this.manager.save(entity);
  }
}
