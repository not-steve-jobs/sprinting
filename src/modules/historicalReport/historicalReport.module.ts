import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {HistoricalReportRepository} from './historicalReport.repository';
import {HistoricalReportController} from './historicalReport.controller';
import {HistoricalReportService} from './historicalReport.service';

@Module({
  imports: [CoreModule],
  controllers: [HistoricalReportController],
  providers: [HistoricalReportService, HistoricalReportRepository],
  exports: [HistoricalReportService],
})
export class HistoricalReportModule {}
