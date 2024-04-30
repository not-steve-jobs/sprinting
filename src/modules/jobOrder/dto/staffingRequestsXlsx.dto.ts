import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsNumber, IsString} from 'class-validator';

export class StaffingRequestsXlsxDto {
  @IsString()
  @ApiProperty({
    description: 'Title of the report',
    example: 'Job Order report',
  })
  title: string;

  @IsArray()
  @ApiProperty({
    description: 'List of all job orders with data',
  })
  data: StaffingRequestXlsxDto[];
}

export class StaffingRequestXlsxDto {
  @IsString()
  @ApiProperty({
    description: 'Job order id',
    example: '10000000-0000-4000-0000-000000000107',
  })
  number: string;

  @IsString()
  @ApiProperty({
    description: 'Job order name',
    example: 'Bartenders for the summer',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Job order service type',
    example: 'Temporary',
  })
  serviceType: string;

  @IsString()
  @ApiProperty({
    description: 'Job order submission date',
    example: 'Thursday, January 13th 2022',
  })
  submissionDate: string;

  @IsString()
  @ApiProperty({
    description: 'Name of the creator of the job order',
    example: 'John Doe',
  })
  createBy: string;

  @IsString()
  @ApiProperty({
    description: 'Job order start date',
    example: 'Thursday, January 13th 2022',
  })
  startDate: string;

  @IsString()
  @ApiProperty({
    description: 'Job order end date',
    example: 'Thursday, January 13th 2022',
  })
  endDate: string;

  @IsNumber()
  @ApiProperty({
    description: 'Job order number of positions',
    example: 42,
  })
  noOfPositions: number;

  @IsString()
  @ApiProperty({
    description: 'Job order status',
    example: 'submitted',
  })
  status: string;

  @IsString()
  @ApiProperty({
    description: 'Job order location',
    example: 'Berlin Tech center - 000000000010-0',
  })
  location: string;

  @IsString()
  @ApiProperty({
    description: 'Job order role',
    example: 'Manager Assistant',
  })
  role: string;
}
