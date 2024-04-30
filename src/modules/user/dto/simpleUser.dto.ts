import {ApiProperty} from '@nestjs/swagger';
import {IsEmail} from 'class-validator';
export class SimpleUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email address',
    example: 'user@@adeccogroup.com',
  })
  email: string;
}
