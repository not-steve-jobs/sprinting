import {Injectable} from '@nestjs/common';

import {AuditLog} from './auditLog.entity';
import {AuditLogEntityName, AuditLogOrigin, AuditLogType} from './auditLog.enum';
import {AuditLogRepository} from './auditLog.repository';
import {CreateAuditLogDto} from './dto/createAuditLog.dto';
import {JobOrderAuditLogDto} from './dto/jobOrder.dto';

@Injectable()
export class AuditLogService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  public async findAllByEntity(
    tenantId: number,
    entityId: string,
    entityName: AuditLogEntityName,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.find(tenantId, entityId, entityName);
  }

  /**
   * Create a new AuditLog when a JobOrder wsa edited
   *
   * @param {JobOrderAuditLogDto} jobOrderEditAuditLog - Details for the changes which were made to the JobOrder
   * @returns {Promise<AuditLog>}
   */
  public async updateOrder(jobOrderEditAuditLog: JobOrderAuditLogDto): Promise<AuditLog> {
    const auditLog: CreateAuditLogDto = {
      tenantId: jobOrderEditAuditLog.tenantId,
      type: jobOrderEditAuditLog.type || AuditLogType.JobOrderUpdated,
      origin: AuditLogOrigin.ClientAccess,
      entityId: jobOrderEditAuditLog.jobOrderId,
      entityName: AuditLogEntityName.JobOrder,
      userId: jobOrderEditAuditLog?.userId,
      firstName: jobOrderEditAuditLog?.firstName,
      lastName: jobOrderEditAuditLog?.lastName,
      changes: jobOrderEditAuditLog.changes,
    };

    return this.create(auditLog);
  }

  /**
   * Create a new AuditLog record
   *
   * @param {JobOrderAuditLogDto} auditLogData - Details for the new record
   * @returns {AuditLog} - The new AuditLog record which was saved in the DB
   */
  public async create(auditLogData: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = new AuditLog(auditLogData);

    return this.auditLogRepository.save(auditLog);
  }
}
