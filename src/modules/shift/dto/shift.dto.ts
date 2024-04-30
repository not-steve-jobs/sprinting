import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class ShiftDto {
  @IsNumber()
  @ApiProperty({
    description: 'Shift id',
    example: '1',
  })
  public id: number;

  @IsNumber()
  @ApiProperty({
    description: 'Shift tenant id',
    example: 110,
  })
  public tenantId: number;

  @IsString()
  @ApiProperty({
    description: 'Shift name',
    example: 'Morning',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'Shift key name',
    example: 'morning',
  })
  public keyName: string;

  @ApiProperty({
    description: 'Shift created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Shift updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
