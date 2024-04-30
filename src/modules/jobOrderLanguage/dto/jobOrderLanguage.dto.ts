import {PlainObject} from 'src/modules/common/common.dto';
import {ApiProperty} from '@nestjs/swagger';
import {IsUUID, IsNumber, IsOptional} from 'class-validator';

export class JobOrderLanguageDto {
  @IsUUID()
  @ApiProperty({
    description: 'Job order id',
    example: '38413361-cff3-4707-9bcf-1d4ad893a4fc',
  })
  public jobOrderId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Selected language id',
    example: '00000000-0000-4000-0000-000000000002',
  })
  public languageId: string;

  @IsNumber()
  @ApiProperty({
    description: 'Level id',
    example: '2',
  })
  public levelId: number;

  @ApiProperty({
    description: 'Job order language tenant id',
    example: 110,
  })
  tenantId: number;

  @IsOptional()
  @ApiProperty({
    description: 'Job order language tenant object',
  })
  tenant?: PlainObject;

  @ApiProperty({
    description: 'Job order language created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Job order language updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
