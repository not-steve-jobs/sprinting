import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {ReportController} from './report.controller';
import {ReportService} from './report.service';
import {CustomHttpModule} from '../customHttp/customHttp.module';

@Module({
  controllers: [ReportController],
  imports: [CustomHttpModule, CoreModule, TypeOrmModule.forFeature([TenantUserRepository])],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
