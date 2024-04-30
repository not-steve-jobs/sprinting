import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Controller, Get, Res} from '@nestjs/common';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {HistoricalReportService} from './historicalReport.service';
import {Response} from 'express';
import {Readable} from 'stream';

@ApiTags('Historical Report')
@Controller()
export class HistoricalReportController {
  public constructor(private readonly service: HistoricalReportService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving historical report'})
  @Get('/historicalReport')
  public async get(@Res() response: Response) {
    const csv = await this.service.getHistoricalUsersReportCsv();
    const stream = Readable.from(csv);
    response.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=historicalReport.csv',
    });
    stream.pipe(response);
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({
    summary:
      'Handler for retrieving Communication cases report for closed cases, created cases and number of messages in cases.',
  })
  @Get('/communicationCasesReport')
  public async getCommunicationCasesReport(@Res() response: Response) {
    const csv = await this.service.getCommunicationCasesReportCsv();
    const stream = Readable.from(csv);
    response.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=communicationCasesReport.csv',
    });
    stream.pipe(response);
  }
}
