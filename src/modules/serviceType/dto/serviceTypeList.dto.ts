import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class ServiceTypeListDto {
  @IsNumber()
  @ApiProperty({
    description: 'Service type id',
    example: '1',
  })
  public id: number;

  @IsString()
  @ApiProperty({
    description: 'Service type name',
    example: 'Temporary',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'Service type key name',
    example: 'temporary',
  })
  public keyName: string;
}
