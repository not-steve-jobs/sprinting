import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNumber} from 'class-validator';

export class PersonDto {
  @IsNumber()
  @ApiProperty({
    description: 'Person id',
    example: '1',
  })
  public id: number;

  @IsString()
  @ApiProperty({
    description: 'Persons First Name',
    example: 'John',
  })
  public firstName: string;

  @IsString()
  @ApiProperty({
    description: 'Persons Last Name',
    example: 'Smith',
  })
  public lastName: string;
}
