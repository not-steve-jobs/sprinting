import {ApiProperty} from '@nestjs/swagger';
import {IsOptional} from 'class-validator';

export class CloseReasonArgumentsPayload {
  @ApiProperty({
    description: 'ID of close reason',
    example: 79,
  })
  closeReasonId: number;

  @ApiProperty({
    description: 'Comment for closing the job order',
    example: 'The user is disabled',
  })
  @IsOptional()
  comment: string;
}
