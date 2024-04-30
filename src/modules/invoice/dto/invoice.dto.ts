import {PlainObject} from './../../common/common.dto';
import {ApiProperty} from '@nestjs/swagger';
import {Invoice} from '../invoice.entity';

export class InvoiceDto {
  @ApiProperty({
    description: 'Invoice id',
    example: '00000000-0000-4000-0000-000000001161',
  })
  id: string;

  @ApiProperty({
    description: 'Invoice tenant id',
    example: 110,
  })
  tenantId: number;

  @ApiProperty({
    description: 'Invoice tenant object',
  })
  tenant: PlainObject;

  @ApiProperty({
    description: 'Invoice number',
    example: 'W912HN-C001',
  })
  number: string;

  @ApiProperty({
    description: 'Invoice location object',
  })
  location: PlainObject;

  @ApiProperty({
    description: 'Invoice location id',
    example: '00000000-0000-4000-0000-000000001164',
  })
  locationId: string;

  @ApiProperty({
    description: 'Invoice date start',
    example: '2017-09-20 10:06:59',
  })
  issueDate: Date;

  @ApiProperty({
    description: 'Invoice total amount',
    example: 112900,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Invoice hours billed',
    example: 398,
  })
  hoursBilled: number;

  @ApiProperty({
    description: 'Invoice status id',
    example: 36,
  })
  statusId: number;

  @ApiProperty({
    description: 'Invoice payment due date',
    example: '2021-05-23 14:17:30',
  })
  duePaymentDate: Date;

  @ApiProperty({
    description: 'Invoice attachment',
    example: 'https://attachment.link',
  })
  attachments: string;

  @ApiProperty({
    description: 'Invoice create date',
    example: '2021-02-23 14:17:36',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Invoice update date',
    example: '2021-02-23 14:17:36',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Invoice period start',
    example: '2013-04-06 21:57:28',
  })
  periodStart?: Date;

  @ApiProperty({
    description: 'Invoice period end',
    example: '2014-12-09 21:26:04',
  })
  periodEnd?: Date;

  @ApiProperty({
    description: 'Invoice credit notes',
    example: 'Some notes...',
  })
  creditNotes?: string;

  @ApiProperty({
    description: 'Invoice currency',
    example: 'EUR',
  })
  currency?: string;

  @ApiProperty({
    description: 'Invoice amount before tax',
    example: 68836,
  })
  amountBeforeTax?: number;

  constructor(obj: Invoice) {
    this.id = obj.id;
    this.tenantId = obj.tenantId;
    this.tenant = obj.tenant;
    this.number = obj.number;
    this.location = obj.location;
    this.locationId = obj.locationId;
    this.issueDate = obj.issueDate;
    this.totalAmount = obj.totalAmount;
    this.hoursBilled = obj.hoursBilled;
    this.statusId = obj.statusId;
    this.duePaymentDate = obj.duePaymentDate;
    this.attachments = obj.attachments;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.periodStart = obj.periodStart;
    this.periodEnd = obj.periodEnd;
    this.creditNotes = obj.creditNotes;
    this.currency = obj.currency;
    this.amountBeforeTax = obj.amountBeforeTax;
  }
}
