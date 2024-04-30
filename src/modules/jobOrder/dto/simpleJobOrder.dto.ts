import {ApiProperty} from '@nestjs/swagger';
import {JobOrderStatus} from 'src/modules/status/status.enum';

export class SimpleJobOrderDto {
  @ApiProperty({
    description: 'Job order id',
    example: '9af7d832-3b32-443a-b496-2c6ea567b851',
  })
  number: string; // Obviously!

  @ApiProperty({
    description: 'Date when the job order starts',
    example: '2022-02-11T08:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Date when the job order ends',
    example: '2022-02-11T16:00:00.000Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'Status name',
    example: 'submitted',
  })
  status: JobOrderStatus;

  @ApiProperty({
    description: 'Status Id',
    example: '5',
  })
  statusId: number;
}
