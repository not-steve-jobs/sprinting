import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class CognitiveSearchDto {
  @IsString()
  @ApiProperty({
    description: 'Searching term',
    example: 'Location',
  })
  term: string;
}
