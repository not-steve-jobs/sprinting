import {Logger} from './../core/logger';
import {Injectable} from '@nestjs/common';
import {ApiProperty} from '@nestjs/swagger';
import carbone from 'carbone';

export class GenerateXlsxDto {
  @ApiProperty({
    description: 'Generate Xlsx buffer',
  })
  buffer: string;

  @ApiProperty({
    description: 'Generate Xlsx filename',
  })
  filename: string;

  @ApiProperty({
    description: 'Generate Xlsx content type',
  })
  contentType: string;
}

@Injectable()
export class ExportHelper {
  public constructor(private readonly logger: Logger) {}

  public async generateXlsx(data: any, xlsxTemplateName: string): Promise<GenerateXlsxDto> {
    const loggerInstance = this.logger;
    return new Promise((resolve) => {
      carbone.render(`./src/lib/assets/${xlsxTemplateName}.xlsx`, data, function (err, result) {
        if (err) {
          loggerInstance.error(__filename, 'Generate export file error', err);
        }
        const buffer = Buffer.from(result.toString('base64'), 'binary').toString();
        return resolve({
          buffer,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          filename: 'export.xlsx',
        });
      });
    });
  }
}
