import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class RateListDto {
  @IsNumber()
  @ApiProperty({
    description: 'Rate id',
    example: '8',
  })
  public id: number;

  @IsString()
  @ApiProperty({
    description: 'Rate name',
    example: 'Monthly',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'Rate key name',
    example: 'monthly',
  })
  public keyName: string;
}
