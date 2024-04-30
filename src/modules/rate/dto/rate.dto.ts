import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class RateDto {
  @IsNumber()
  @ApiProperty({
    description: 'Rate id',
    example: '1',
  })
  public id: number;

  @IsNumber()
  @ApiProperty({
    description: 'Rate tenant id',
    example: 110,
  })
  public tenantId: number;

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

  @ApiProperty({
    description: 'Rate created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Rate updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
