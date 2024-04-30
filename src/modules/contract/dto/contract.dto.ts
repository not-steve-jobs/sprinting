import {PlainObject} from './../../common/common.dto';
import {ApiProperty} from '@nestjs/swagger';
import {Contract} from '../contract.entity';
import {IsOptional} from 'class-validator';

export class ContractDto {
  @ApiProperty({
    description: 'Contract id',
    example: '00000000-0000-4000-0000-000000001161',
  })
  id: string;

  @ApiProperty({
    description: 'Contract tenant id',
    example: 110,
  })
  tenantId: number;

  @IsOptional()
  @ApiProperty({
    description: 'Contract tenant object',
  })
  tenant?: PlainObject;

  @ApiProperty({
    description: 'Contract number',
    example: 'W912HN-C001',
  })
  number: string;

  @IsOptional()
  @ApiProperty({
    description: 'Contract location object',
  })
  location?: PlainObject;

  @ApiProperty({
    description: 'Contract location id',
    example: '00000000-0000-4000-0000-000000001164',
  })
  locationId?: string;

  @ApiProperty({
    description: 'Contract date start',
    example: '2017-09-20 10:06:59',
  })
  dateStart: Date;

  @ApiProperty({
    description: 'Contract date end',
    example: '2013-12-04 00:25:52',
  })
  dateEnd: Date;

  @ApiProperty({
    description: 'Contract status id',
    example: 32,
  })
  statusId: number;

  @IsOptional()
  @ApiProperty({
    description: 'Contract type id',
    example: 2,
  })
  typeId?: number;

  @ApiProperty({
    description: 'Contract signature date',
    example: '2015-04-21 14:59:01',
  })
  signatureDate: Date;

  @ApiProperty({
    description: 'Contract create date',
    example: '2021-02-22 22:56:41',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Contract update date',
    example: '2021-02-22 22:56:41',
  })
  updatedAt: Date;

  constructor(obj?: Contract) {
    Object.assign(this, obj);
  }
}
