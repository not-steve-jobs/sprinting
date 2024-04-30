import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class ServiceTypeDto {
  @IsNumber()
  @ApiProperty({
    description: 'Service type id',
    example: '1',
  })
  public id: number;

  @IsNumber()
  @ApiProperty({
    description: 'Service type tenant id',
    example: 110,
  })
  public tenantId: number;

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

  @ApiProperty({
    description: 'Service type created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Service type updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
