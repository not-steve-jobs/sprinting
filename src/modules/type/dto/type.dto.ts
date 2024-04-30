import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNumber, Max} from 'class-validator';

export class TypeDto {
  @IsNumber()
  @ApiProperty({
    description: 'Type id',
    example: '1',
  })
  public id: number;

  @IsString()
  @ApiProperty({
    description: 'Describes for which entity we are using this type',
    example: 'Contract',
  })
  public entityName: string;

  @Max(255)
  @ApiProperty({
    description: 'Type name',
    example: 'studentPayroll',
  })
  public name: string;

  @ApiProperty({
    description: 'Type created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Type updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
