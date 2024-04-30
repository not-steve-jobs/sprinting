import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class ShiftListDto {
  @IsNumber()
  @ApiProperty({
    description: 'Shift id',
    example: '1',
  })
  public id: number;

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
}
