import {PlainObject} from 'src/modules/common/common.dto';
import {ApiProperty} from '@nestjs/swagger';
import {IsOptional, IsUUID} from 'class-validator';

export class JobOrderCertificationDto {
  @IsUUID()
  @ApiProperty({
    description: 'Job order id',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  public jobOrderId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Selected certification id',
    example: '00000000-0000-4000-0000-000000000002',
  })
  public certificationId: string;

  @ApiProperty({
    description: 'Job order certification tenant id',
    example: 110,
  })
  tenantId: number;

  @IsOptional()
  @ApiProperty({
    description: 'Job order certification tenant object',
  })
  tenant?: PlainObject;

  @ApiProperty({
    description: 'Job order certification start date',
    example: '2021-02-02 12:32:00',
  })
  public dateStart: Date;

  @ApiProperty({
    description: 'Job order certification end date',
    example: '2021-02-02 12:32:00',
  })
  public dateEnd: Date;

  @ApiProperty({
    description: 'Job order certification created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Job order certification updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
