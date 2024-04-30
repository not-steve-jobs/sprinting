import {PlainObject} from 'src/modules/common/common.dto';
import {Injectable} from '@nestjs/common';
import {HistoricalReportRepository} from './historicalReport.repository';
import {ExportToCsv} from 'export-to-csv';

@Injectable()
export class HistoricalReportService {
  constructor(private readonly repository: HistoricalReportRepository, private readonly exporterToCsv: ExportToCsv) {}

  public async getHistoricalUsersReportCsv(): Promise<string> {
    const records = await this.repository.get();
    return this.generateCSV(records);
  }

  public async getCommunicationCasesReportCsv(): Promise<string> {
    const records = await this.repository.getCommunicationCases();
    return this.generateCSV(records);
  }

  public async getNpsReportCsv(): Promise<string> {
    const records = await this.repository.getNpsReport();
    return this.generateCSV(records);
  }

  public generateCSV(records: PlainObject[]): Promise<string> {
    if ((records ?? []).length === 0) return Promise.resolve('');
    this.exporterToCsv.options.showLabels = true;
    this.exporterToCsv.options.useKeysAsHeaders = true;
    return this.exporterToCsv.generateCsv(records, true);
  }
}
