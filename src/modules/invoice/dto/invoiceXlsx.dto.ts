import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsNumber, IsString} from 'class-validator';
import {Invoice} from '../invoice.entity';

export class InvoicesXlsxDto {
  @IsString()
  @ApiProperty({
    description: 'Title of the report',
    example: 'Invoices report',
  })
  title: string;

  @IsArray()
  @ApiProperty({
    description: 'List of all invoices with data',
  })
  data: InvoiceXlsxDto[];
}

export class InvoiceXlsxDto {
  @IsString()
  @ApiProperty({
    description: 'Invoice number',
    example: 'W912HN-I008',
  })
  invoiceNumber: string;

  @IsString()
  @ApiProperty({
    description: 'Invoice period',
  })
  invoicePeriod: string;

  @IsNumber()
  @ApiProperty({
    description: 'Invoice hours billed',
    example: 42,
  })
  hoursBilled: number;

  @IsString()
  @ApiProperty({
    description: 'Invoice status',
    example: 'paid',
  })
  invoiceStatus: string;

  @IsString()
  @ApiProperty({
    description: 'Invoice due payment date',
    example: 'Wednesday, January 12th 2022',
  })
  duePaymentDate: string;

  @IsString()
  @ApiProperty({
    description: 'Invoice attachments',
  })
  invoiceAttachments: string;

  constructor(obj?: Invoice) {
    Object.assign(this, obj);
  }
}
