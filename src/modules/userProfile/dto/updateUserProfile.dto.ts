import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsOptional, IsString} from 'class-validator';

// NOTE: This code should probably be removed when #2909 tech debt task is implemented
export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User language',
    example: 'en_US',
  })
  language: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'User counter of opened cases before NPS is shown',
    example: 1,
  })
  caseCounter: number;
}
