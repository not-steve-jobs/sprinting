import {ApiProperty} from '@nestjs/swagger';
import {IsNumber} from 'class-validator';

export class GetRegionWageDto {
  @ApiProperty({
    description: 'Job role id',
    example: '00000000-0000-4000-0000-000000001101',
  })
  jobRoleId: string;

  @IsNumber()
  @ApiProperty({
    description: 'Expirence Level id',
    example: 10,
  })
  experienceLevelId: number;
}
