import {Injectable} from '@nestjs/common';
import {Logger} from '../../core/logger';
import {CommonError} from './common.error';
import {TestLoggerResponseDto} from './testLogger.dto';

@Injectable()
export class CommonService {
  constructor(private readonly logger: Logger) {}

  async testLogger(): Promise<TestLoggerResponseDto> {
    const d = {
      a: 1,
      b: true,
      c: 'test',
    };
    this.logger.trace(__filename, 'trace message without data');
    this.logger.trace(__filename, 'trace message with data', d);
    this.logger.debug(__filename, 'debug message without data');
    this.logger.debug(__filename, 'debug message with data', d);
    this.logger.info(__filename, 'info message without data');
    this.logger.info(__filename, 'info message with data', d);
    this.logger.error(__filename, 'error message without data');
    this.logger.error(__filename, 'error message with data', d);
    this.logger.errorObject(__filename, new CommonError.CommonServiceIntentionalError());

    return {status: 'ok'};
  }
}
