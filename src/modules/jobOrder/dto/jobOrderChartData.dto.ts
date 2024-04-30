import {ApiProperty} from '@nestjs/swagger';

export class JobOrderChartDataDto {
  @ApiProperty({
    description: 'Job order id',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  id: string;

  @ApiProperty({
    description: 'Job order status',
    example: '2',
  })
  statusId: number;

  @ApiProperty({
    description: 'Date when job order was submitted',
    example: '2021-02-02 12:32:00',
  })
  submissionDate: Date;
}
