import {ApiProperty} from '@nestjs/swagger';

export class PreferencesDto {
  @ApiProperty({
    description: 'Save users choice for job orders chart be shown or not',
    example: 'true',
  })
  isJobOrderChartShown?: boolean;
}
