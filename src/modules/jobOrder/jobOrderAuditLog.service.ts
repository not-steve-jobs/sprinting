import {Injectable} from '@nestjs/common';

import {AuditLog} from 'src/modules/auditLog/auditLog.entity';
import {AuditLogService} from 'src/modules/auditLog/auditLog.service';
import {JobOrderAuditLogDto} from 'src/modules/auditLog/dto/jobOrder.dto';
import {AuditLogEntityName, AuditLogOrigin, AuditLogType} from '../auditLog/auditLog.enum';

import {JobOrder} from './jobOrder.entity';

@Injectable()
export class JobOrderAuditLogService {
  constructor(private readonly auditLogService: AuditLogService) {}

  // Note: TypeORM doesn't support polymorphic relationships so we can't rely on the entity to define this relation
  public async findJobOrderAudits(jobOrder: JobOrder): Promise<AuditLog[]> {
    return this.auditLogService.findAllByEntity(jobOrder.tenantId, jobOrder.id, AuditLogEntityName.JobOrder);
  }

  public async updateOrder(
    userId: string,
    jobOrder: JobOrder,
    origin: AuditLogOrigin,
    type: AuditLogType = AuditLogType.JobOrderUpdated,
  ): Promise<AuditLog> {
    const newJobOrderUpdate: JobOrderAuditLogDto = {
      origin,
      type,
      tenantId: jobOrder.tenantId,
      jobOrderId: jobOrder.id,
      userId: userId,
      changes: jobOrder.getAttributesChangeLog(),
    };
    return this.auditLogService.updateOrder(newJobOrderUpdate);
  }
}
