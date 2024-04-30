import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsString} from 'class-validator';
import {Contract} from '../contract.entity';

export class ContractsXlsxDto {
  @IsString()
  @ApiProperty({
    description: 'Title of the report',
    example: 'Contracts report',
  })
  title: string;

  @IsArray()
  @ApiProperty({
    description: 'List of all contracts with data',
  })
  data: ContractXlsxDto[];
}

export class ContractXlsxDto {
  @IsString()
  @ApiProperty({
    description: 'Associate name',
    example: 'John Doe',
  })
  associateName: string;

  @IsString()
  @ApiProperty({
    description: 'Contract number',
    example: 'W912HN-C001',
  })
  number: string;

  @IsString()
  @ApiProperty({
    description: 'Contract location object',
    example: 'Munchen Tech 1 - 000000000010-3',
  })
  location: string;

  @IsString()
  @ApiProperty({
    description: 'Contract date start',
    example: '2017-09-20 10:06:59',
  })
  dateStart: string;

  @IsString()
  @ApiProperty({
    description: 'Contract date end',
    example: '2013-12-04 00:25:52',
  })
  dateEnd: string;

  @IsString()
  @ApiProperty({
    description: 'Contract status',
    example: 'Closed',
  })
  status: string;

  @IsString()
  @ApiProperty({
    description: 'Contract type id',
    example: 'Temporary',
  })
  type: string;

  @IsString()
  @ApiProperty({
    description: 'Contract service',
  })
  service: string;

  @IsString()
  @ApiProperty({
    description: 'Contract signature date',
    example: '2015-04-21 14:59:01',
  })
  signatureDate: string;

  constructor(obj?: Contract) {
    Object.assign(this, obj);
  }
}
