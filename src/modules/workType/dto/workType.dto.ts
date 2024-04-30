import {ApiProperty} from '@nestjs/swagger';

export class WorkTypeDto {
  @ApiProperty({
    description: 'Work type id',
    example: 3,
  })
  id: number;

  @ApiProperty({
    description: 'Work type tenant id',
    example: 2,
  })
  tenantId: number;

  @ApiProperty({
    description: 'Work type name',
    example: 'Worksite based',
  })
  name: string;

  @ApiProperty({
    description: 'Work type created date',
    example: '2021-02-02 12:32:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Work type updated date',
    example: '2021-02-02 12:32:00',
  })
  updatedAt: Date;
}
