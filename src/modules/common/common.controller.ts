import {Controller, Get} from '@nestjs/common';
import {CommonService} from './common.service';
import {TestLoggerResponseDto} from './testLogger.dto';

@Controller()
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('/test-logger')
  async testLogger(): Promise<TestLoggerResponseDto> {
    return await this.commonService.testLogger();
  }
}
