import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNumber, Max} from 'class-validator';

export class StatusDto {
  @IsNumber()
  @ApiProperty({
    description: 'Status id',
    example: '1',
  })
  public id: number;

  @IsString()
  @ApiProperty({
    description: 'Describes for which entity we are using this status',
    example: 'Contract',
  })
  public entityName: string;

  @Max(255)
  @ApiProperty({
    description: 'Status name',
    example: 'Draft',
  })
  public name: string;

  @ApiProperty({
    description: 'Status created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Status updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
