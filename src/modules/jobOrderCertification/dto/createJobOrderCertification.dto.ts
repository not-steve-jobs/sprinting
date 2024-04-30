import {ApiProperty} from '@nestjs/swagger';
import {IsOptional, IsUUID} from 'class-validator';

export class CreateJobOrderCertificationDto {
  @IsUUID()
  @ApiProperty({
    description: 'Selected certification id',
    example: '00000000-0000-4000-0000-000000000002',
  })
  public certificationId: string;

  @IsOptional()
  @ApiProperty({
    description: 'Job order certification start date',
    example: '2021-02-02 12:32:00',
  })
  public dateStart?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Job order certification end date',
    example: '2021-02-02 12:32:00',
  })
  public dateEnd?: Date;
}
