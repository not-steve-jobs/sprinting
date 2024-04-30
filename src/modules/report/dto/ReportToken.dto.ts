import {IsArray, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {PowerBiReportData} from '../powerBiReportData';

export class ReportTokenDto {
  @IsString()
  @ApiProperty({
    description: 'Power BI access token',
    example: '',
  })
  accessToken: string;

  @IsArray()
  @ApiProperty({
    description: 'Power BI embed url',
    example: '',
  })
  embedUrl: PowerBiReportData[];

  @IsString()
  @ApiProperty({
    description: 'Power BI token expiration date',
    example: 'Doe',
  })
  expiry: string;
}
