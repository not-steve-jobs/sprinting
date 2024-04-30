import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsNumber, IsObject, IsString} from 'class-validator';
import {JobOrderAssociatesDataXlsxDto} from 'src/modules/jobOrderAssociate/dto/jobOrderAssociatesXlsx.dto';

export class JobOrderDetailsXlsxDto {
  @IsString()
  @ApiProperty({
    description: 'Title of the report',
    example: 'Job Order report',
  })
  title: string;

  @IsObject()
  @ApiProperty({
    description: 'List of all job orders with data',
  })
  data: JobOrderDetailsDataXlsxDto;
}

export class JobOrderDetailsDataXlsxDto {
  @IsObject()
  @ApiProperty()
  orderDetails: OrderDetailsDataXlsxDto;

  @IsArray()
  @ApiProperty()
  candidatesList: JobOrderAssociatesDataXlsxDto[];
}

export class OrderDetailsDataXlsxDto {
  @IsString()
  @ApiProperty({
    description: 'Job order name',
    example: 'Bartenders for the summer',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Job order reference number',
    example: '00000107',
  })
  referenceNumber: string;

  @IsString()
  @ApiProperty({
    description: 'Job order creator',
    example: 'John Doe',
  })
  userName: string;

  @IsString()
  @ApiProperty({
    description: 'Job order creation date',
    example: '20 Dec 2021',
  })
  dateSubmission: string;

  @IsString()
  @ApiProperty({
    description: 'Job order estimated salary',
    example: '42 $',
  })
  salary: string;

  @IsString()
  @ApiProperty({
    description: 'Job order location',
    example: 'Cardinal Drive, 123, 42311, Barcelona',
  })
  location: string;

  @IsString()
  @ApiProperty({
    description: 'Job order role and experience',
    example: 'Car Mechanic',
  })
  roleAndExperience: string;

  @IsNumber()
  @ApiProperty({
    description: 'Job order number of positions',
    example: 42,
  })
  numberOfOpenings: number;

  @IsString()
  @ApiProperty({
    description: 'Job order details data',
    example: 'English-Advanced, French-Advanced',
  })
  languages: string;

  @IsString()
  @ApiProperty({
    description: 'Job order scheduled time period',
    example: '20 Dec 2021 - 30 Jan 2022',
  })
  scheduledPeriod: string;

  @IsString()
  @ApiProperty({
    description: 'Job order working days of the week',
    example: 'Sat, Sun',
  })
  workingDays: string;

  @IsString()
  @ApiProperty({
    description: 'Job order work time',
    example: 'From 08:30 To 17:30',
  })
  workTime: string;

  @IsNumber()
  @ApiProperty({
    description: 'Job order number of working days',
    example: 42,
  })
  numOfWorkingDays: number;

  @IsString()
  @ApiProperty({
    description: 'Job order day one guidance',
    example: 'Start working',
  })
  dayOneGuidance: string;
}
