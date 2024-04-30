import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {CoreModule} from 'src/core/core.module';

import {AuditLogService} from './auditLog.service';
import {AuditLogRepository} from './auditLog.repository';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([AuditLogRepository])],
  controllers: [],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
